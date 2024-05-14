import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { AntDesignOutlined } from '@ant-design/icons';
import './MainLayout.css';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout className="layout">
      <Header> 
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/candidates">Candidatos</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>ATS ©2023 Creado por CursorBot</Footer>
    </Layout>
  );
};

export default MainLayout;