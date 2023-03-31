import React from 'react';
import { Table, Tag, Card } from 'antd';





export default function Trainee(props) {
    let maxMarks=props.maxmMarks || 2;
    const columns = [
        {
            title: 'Tên',
            dataIndex: 'userid.name',
            key: 'userid.name'
        },
        {
            title: 'Email',
            dataIndex: 'userid.emailid',
            key: 'userid.emailid',
        },
        {
            title: 'Liên hệ',
            dataIndex: 'userid.contact',
            key: 'userid.contact',
        },
        {
            title: 'Lớp',
            dataIndex: 'userid.organisation',
            key: 'userid.organisation',
        },
        {
            title:'Điểm',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title:'Trạng thái',
            dataIndex:'score',
            key: '_id',
            render: tag => (
                <span>
                    <Tag color={tag >= maxMarks/2 ? 'green' : 'red'} key={tag}>
                        {tag >= maxMarks/2 ? 'Đạt' : 'Trượt'}
                    </Tag>
                </span>
            )
        }
    ];
    return (
        <div>
            <Card>
                <div className="download-section">
                    <Table pagination={false} rowKey="_id" columns={columns} dataSource={props.stats}/>
                </div>
            </Card>
        </div>
    )
}
