import React, { Component } from 'react';
import { Table, Input, Button, Icon, Typography, Modal, Tag, Divider } from 'antd';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';
import {
  ChangeTestSearchText,
  ChangeTestTableData,
  ChangeTestDetailsModalState
} from '../../../actions/trainerAction';
import './alltest.css';
import moment from 'moment';

import TestDetails from '../testdetails/testdetails';




class AllTests extends Component {

  openModal = (id) => {
    this.props.ChangeTestDetailsModalState(true, id);
  }

  closeModal = () => {
    this.props.ChangeTestDetailsModalState(false, null);
  }
  componentDidMount() {
    this.props.ChangeTestTableData();
  }

  getColumnSearchProps = (dataIndex, displayName) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`${displayName}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Tìm
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Đặt lại
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.props.trainer.TestsearchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.props.ChangeTestSearchText(selectedKeys[0])
  };

  handleReset = clearFilters => {
    clearFilters();
    this.props.ChangeTestSearchText('')
  };

  render() {
    const { Title } = Typography;
    const columns = [
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        ...this.getColumnSearchProps('title', 'Tên tiêu đề'),
      },
      {
        title: 'Loại',
        dataIndex: 'type',
        key: 'type',
        ...this.getColumnSearchProps('type', 'Tên loại'),
        render: tags => {
          if(tags === 'pre-test') {
            return (
              <span>
                Kiểm tra kiến thức
              </span>
            );
          } else {
            return (
              <span>
                Kiểm tra cuối kỳ
              </span>
            );
          }
        }
      },
      {
        title: 'Môn',
        dataIndex: 'subjects',
        key: 'subjects._id',
        render: tags => (
          <span>
            {tags.map((tag, i) => {
              let color = 'geekblue';
              return (
                <Tag color={color} key={tag._id}>
                  {tag.topic.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        ...this.getColumnSearchProps('createdAt', 'Ngày tạo'),
        render: tags => (
          <span>
            {moment(tags).format("DD/ MM/YYYY")}
          </span>
        )
      },
      {
        title: 'Hành động',
        key: '_id',
        dataIndex: '_id',
        render: (key) => (
          <span>
            <Button type="primary" shape="square" icon="info-circle" onClick={() => this.openModal(key)} />
            <Divider type="vertical" />
            <Button type="primary" shape="circle" icon="file" onClick={() => window.location.href = `/user/conducttest?testid=${key}`} />
          </span>
        ),
      },
    ];
    return (
      <div className="admin-table-container">
        <div className="register-trainer-form-header">
          <Title level={4} style={{ color: '#fff', textAlign: 'center' }}>Danh sách đề</Title>
        </div>
        <Table
          bordered={true}
          columns={columns}
          dataSource={this.props.trainer.TestTableData}
          size="medium"
          pagination={{ pageSize: 10 }}
          loading={this.props.trainer.TestTableLoading}
          rowKey="_id"
        />;
        <Modal
          visible={this.props.trainer.TestDetailsmodalOpened}
          title="Chi tiết"
          onOk={this.handleOk}
          onCancel={this.closeModal}
          afterClose={this.closeModal}
          style={{ top: '20px', padding: '0px', backgroundColor: 'rgb(155,175,190)' }}
          width="90%"
          destroyOnClose={true}
          footer={[

          ]}
        >
          <TestDetails />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  trainer: state.trainer
});

export default connect(mapStateToProps, {
  ChangeTestSearchText,
  ChangeTestTableData,
  ChangeTestDetailsModalState
})(AllTests);