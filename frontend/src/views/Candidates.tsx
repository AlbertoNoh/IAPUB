import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Upload, message } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { getCandidates, addCandidate, getCandidateById, updateCandidate, deleteCandidate } from '../services/api';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);


  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      message.error('Error al cargar los candidatos');
    }
  };

  const showModal = async (candidateId?: number) => {
    if (candidateId) {
      try {
        const candidateData = await getCandidateById(candidateId);
        form.setFieldsValue(candidateData);
        setCurrentCandidate(candidateData);
        setIsEditMode(true);
      } catch (error) {
        message.error('Error al obtener los datos del candidato');
        return;
      }
    } else {
      form.resetFields();
      setIsEditMode(false);
      setCurrentCandidate(null);
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && currentCandidate) {
        await updateCandidate(currentCandidate.id, values, file);
        message.success('Candidato actualizado exitosamente');
      } else {
        await addCandidate(values, file);
        message.success('Candidato añadido exitosamente');
      }
      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
      fetchCandidates();
    } catch (error) {
      message.error('Error al procesar el formulario del candidato');
    }
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  interface Candidate {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    documentUrl: string | null;
  }
  
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Apellido',
      dataIndex: 'surname',
      key: 'surname',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
        title: 'Documento',
        key: 'document',
        render: (_:unknown, record: Candidate) => record.documentUrl ? (
          <a href={`${record.documentUrl}`} target="_blank" rel="noopener noreferrer">
            <Button icon={<FileTextOutlined />}>Ver Documento</Button>
          </a>
        ) : null,
      },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_:unknown, record: Candidate) => (
        <Space size="middle">
          <Button onClick={() => showModal(record.id)}>Editar</Button>
          <Button onClick={() => handleDelete(record.id)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

 
 

  const handleDelete = async (id: number) => {
    try {
      await deleteCandidate(id);
      message.success('Candidato eliminado exitosamente');
      fetchCandidates(); // Recargar la lista de candidatos
    } catch (error) {
      message.error('Error al eliminar el candidato');
    }
  };

  const onFileChange = (info: any) => {
    if (info.file.status === 'done') {
      setFile(info.file.originFileObj);
    } else if (info.file.status === 'removed') {
      setFile(null);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Añadir Candidato
      </Button>
      <Table columns={columns} dataSource={candidates} rowKey="id" />
      <Modal title={`${isEditMode ? 'Editar' : 'Añadir'} candidato`} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre del candidato' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="surname" label="Apellido" rules={[{ required: true, message: 'Por favor ingresa el apellido del candidato' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Correo Electrónico" rules={[{ type: 'email', message: 'El correo no es válido' }, { required: true, message: 'Por favor ingresa el correo electrónico del candidato' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono" rules={[{ required: true, message: 'Por favor ingresa el teléfono del candidato' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="document" label="Documento (PDF, DOCX)">
            <Upload
              beforeUpload={() => false}
              onChange={onFileChange}
              accept=".pdf,.doc,.docx"
            >
              <Button icon={<UploadOutlined />}>Click para subir documento</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Candidates;