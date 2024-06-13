import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import Button from '../../widget/buttons/button';
import CompassIcon from '../icons/compassIcons';
import { apiRequest } from 'src/api/request';
import { Form, Input, Modal, Popover, Select, Table, notification } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { apiCategory } from 'src/api/category';
// import Button from 'src/widget/buttons/button';

const StaffView = (props) => {
    const [list, setList] = useState([]);
    const [formForward] = Form.useForm(); // Form chuyển tiếp kiến nghị
    const [formEdit] = Form.useForm(); // Form sửa kiến nghị
    const [formAdd] = Form.useForm();
    const [isLogin, setIsLogin] = React.useState(false);
    const [lstRequest, setLstRequest] = useState([]);
    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false); // Mở modal thêm kiến nghị
    const [isOpenModalView, setIsOpenModalView] = useState(false); // Mở modal xem chi tiết kiến nghị
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false); // Mở modal sửa kiến nghị
    const [isOpenModalForward, setIsOpenModalForward] = useState(false); // Mở modal chuyển tiếp kiến nghị
    const [requestChoose, setRequestChoose] = useState < any > ({}); // Kiến nghị cần chuyển tiếp
    const [pageSize, setPageSize] = useState(10); // Số lượng kiến nghị trên 1 trang
    const [lstCategory, setLstCategory] = useState([]); // Danh sách lĩnh vực
    const [lstUser, setLstUser] = useState([]); // Danh sách người dùng
    const [lstAction, setLstAction] = useState([]); // Danh sách hành động
    const [userId, setUserId] = useState(''); // Id người dùng





    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: '30%',
        },
        {
            title: 'Ngày nhận',
            dataIndex: 'receivedAt',
            key: 'receivedAt',
        },
        {
            title: 'Lĩnh vực',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Tình trạng',
            dataIndex: 'statusRequest',
            key: 'statusRequest',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <span
                    style={{
                        cursor: 'pointer',
                    }}>
                    <Popover
                        content={
                            <div className='content-action'>
                                <div
                                    className='content-action-item'
                                    onClick={() => handleViewRequest(record)}>
                                    Xem chi tiết
                                </div>
                                <div
                                    className={'content-action-item ' + (diableAction(record) ? 'disabled-icon' : '')}
                                    onClick={() => {
                                        if (!diableAction(record)) {
                                            handleDeleteRequest(record);
                                        }
                                    }}>
                                    Xóa
                                </div>
                                <div
                                    className={'content-action-item ' + (diableAction(record) ? 'disabled-icon' : '')}
                                    onClick={() => {
                                        if (!diableAction(record)) {
                                            handleEditRequest(record);
                                        }
                                    }
                                    }>
                                    Sửa
                                </div>
                                <div
                                    className={'content-action-item ' + (diableAction(record) ? 'disabled-icon' : '')}
                                    onClick={() => {
                                        if (!diableAction(record)) {
                                            handleForward(record);
                                        }

                                    }}>
                                    Chuyển tiếp
                                </div>
                            </div>
                        }
                        trigger="hover">
                        <EllipsisOutlined />
                    </Popover>

                </span>
            ),
        },
    ];


    useEffect(() => {
        getAllRequest();
        getAllCategory();
    }, []);


    const getAllRequest = async () => {
        console.log("Get all request");
        await apiRequest.getAll()
            .then((res) => {
                console.log(res.data);
                const data = res.data.data.map((item, index) => {
                    console.log(item.category.description);
                    return {
                        id: item.id,
                        key: (index + 1).toString(),
                        title: item.title ? item.title : 'Chưa cập nhật',
                        content: item.content ? item.content : 'Chưa cập nhật',
                        receivedAt: item.receivedAt ? new Date(item.receivedAt).toLocaleDateString() : 'Chưa cập nhật',
                        priority: item.priority ? item.priority : 'Chưa cập nhật',
                        category: item.category.description ? item.category.description : 'Chưa cập nhật',
                        categoryId: item.category.id ? item.category.id : 'Chưa cập nhật',
                        statusRequest: item.statusRequest ? item.statusRequest : 'Chưa cập nhật',
                        people: item.people ? item.people : 'Chưa cập nhật',
                        process: item.processes ? item.processes : ['Xem']
                    }
                });
                console.log("Check", data);
                setLstRequest(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getAllCategory = async () => {
        console.log("Get all category");
        await apiCategory.getAll()
            .then((res) => {
                console.log("category", res.data.data);
                if (res.data.data) {
                    setLstCategory(res.data.data);
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Hàm xử lý khi xem chi tiết kiến nghị
    const handleViewRequest = (record) => {
        console.log(record);
        setIsOpenModalView(true);
        setRequestChoose(record);
    }

    // Hàm xử lý khi xóa kiến nghị
    const handleDeleteRequest = (record) => {
        console.log(record);
        Modal.confirm({
            title: 'Xác nhận xóa kiến nghị',
            content: 'Bạn có chắc chắn muốn xóa kiến nghị này không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            maskClosable: true,
            onOk: async () => {
                await apiRequest.delete(record.id)
                    .then((res) => {
                        console.log(res.data);
                        if (res.data.message !== 'Xóa request thành công') {
                            notification.error({
                                message: 'Xóa thất bại!',
                                description: 'Xóa kiến nghị thất bại!',
                                duration: 3,
                            });
                        }
                        else {
                            notification.success({
                                message: 'Xóa thành công!',
                                description: 'Xóa kiến nghị thành công!',
                                duration: 3,
                            });
                        }

                        getAllRequest();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
        })
    }

    // Hàm xử lý khi chuyển tiếp kiến nghị
    const handleForward = (record) => {
        console.log(record);
        setIsOpenModalForward(true);
        setRequestChoose(record);
    }


    // Hàm xử lý khi chuyển tiếp kiến nghị thành công
    const handleOkModalForward = async () => {
        console.log(formForward.getFieldsValue());
        console.log(requestChoose);

        const { persionForwardTo, actionForward } = formForward.getFieldsValue();

        const req = {
            peopleId: persionForwardTo,
            actionId: actionForward,
        }

        await apiRequest.forward(requestChoose.id, req)
            .then((res) => {
                console.log(res.data);
                if (res.data.message !== 'Chuyển tiếp thành công') {
                    notification.error({
                        message: 'Chuyển tiếp thất bại!',
                        description: res.data.message,
                        duration: 3,
                    });
                }
                else {
                    notification.success({
                        message: 'Chuyển tiếp thành công!',
                        description: 'Chuyển tiếp kiến nghị thành công!',
                        duration: 3,
                    });
                    setIsOpenModalForward(false);
                    formForward.resetFields();
                    getAllRequest();
                }
            })
            .catch((err) => {
                console.log(err);
            });

    }


    const diableAction = (record) => {
        return false;
    }

    // Hàm xử lý khi đóng modal chuyển tiếp kiến nghị
    const handleCloseModalForward = () => {
        setIsOpenModalForward(false);
        formForward.resetFields();
    }

    // Hàm xử lý khi sửa kiến nghị
    const handleEditRequest = (record) => {
        console.log(record);
        setIsOpenModalEdit(true);
        setRequestChoose(record);

        formEdit.setFieldsValue({
            title: record.title,
            content: record.content,
            receivedAt: new Date(),
            priority: record.priority,
            category: record.categoryId,
        });
    }

    // Chỉnh sửa lại phần phân trang
    const handlePagination = {
        pageSize: pageSize,
        total: lstRequest.length,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} kiến nghị`,
        onShowSizeChange: (current, size) => {
            console.log(current, size);
            setPageSize(size);
        },
        locale: { items_per_page: " kiến nghị / trang" }

    }


    // Hàm xử lý khi sửa kiến nghị thành công
    const handleFinishEditRequest = async (values) => {
        console.log(values);
        const { title, content, receivedAt, priority, category } = values;

        const req = {
            title,
            content,
            receivedAt: receivedAt,
            priority: parseInt(priority),
            categoryId: category,
        }

        console.log(req);

        await apiRequest.update(requestChoose.id, req)
            .then((res) => {
                console.log(res.data);
                if (res.data.message !== 'Cập nhật request thành công') {
                    notification.error({
                        message: 'Sửa thất bại!',
                        description: 'Sửa kiến nghị thất bại!',
                        duration: 3,
                    });
                }
                else {
                    notification.success({
                        message: 'Sửa thành công!',
                        description: 'Sửa kiến nghị thành công!',
                        duration: 3,
                    });
                    setIsOpenModalEdit(false);
                    getAllRequest();
                }
            })
            .catch((err) => {
                console.log(err);
            });

        // setLstRequest(tmplst);

        // console.log(lstRequest);


        // setIsOpenModalEdit(false);

        // notification.success({
        //     message: 'Sửa thành công!',
        //     description: 'Sửa kiến nghị thành công!',
        //     duration: 3,
        // });
    }

    // let emptyState = (
    //     <div style={style.completed.container}>
    //         {/* <Tada /> */}
    //         <h3 style={style.completed.title}>{'Không có kiến nghị nào'}</h3>
    //         <p style={style.completed.subtitle}>
    //             {
    //                 'Khi bạn tạo kiến nghị, chúng sẽ xuất hiện ở đây. Bạn có thể tạo kiến nghị bằng cách nhấp vào nút "Thêm kiến nghị mới" trong menu.'
    //             }
    //         </p>

    //     </div>
    // );


    const handleSubmit = async (values) => {
        console.log('submit');
        console.log(values);
        const { title, content, receivedAt, priority, category } = values;
        const newRequest = {
            // key: (lstRequest.length + 1).toString(),
            title,
            content,
            receivedAt: receivedAt,
            categoryId: category,
            // statusRequest: 'Đã tạo'
        }
        await apiRequest.create(newRequest)
            .then((res) => {
                notification.success({
                    message: 'Thêm mới thành công!',
                    description: 'Thêm mới kiến nghị thành công!',
                    duration: 3,
                });
                formAdd.resetFields();
                getAllRequest();
            })
            .catch((err) => {
                console.log(err);
                notification.error({
                    message: 'Thêm mới thất bại!',
                    description: res.data.message,
                    duration: 3,
                });
            });

        formAdd.resetFields();
    };

    const closeAddBox = () => {
        setIsOpenModalAdd(false);
        formAdd.resetFields();
    }


    return (
        <div style={style.rhs}>
            <div style={style.header} >
                <FormattedMessage
                    id='header'
                    defaultMessage='Thường trực HĐND - Kiến nghị'
                />
            </div>
            <Button
                emphasis='primary'
                icon={<CompassIcon icon='plus' />}
                size='small'
                onClick={() => {
                    setIsOpenModalAdd(true);
                }}
            >
                <FormattedMessage
                    id='add-request'
                    defaultMessage='Thêm kiến nghị'
                />
            </Button>
            <div style={style.table}>
                <Table bordered columns={columns} pagination={handlePagination} dataSource={lstRequest} scroll={{ y: 600 }} rowClassName={(record, index) => { return diableAction(record) ? 'row-inactive' : ''; }} />
            </div>
            <Modal
                title="Xem chi tiết kiến nghị"
                open={isOpenModalView}
                footer={null}
                onCancel={() => setIsOpenModalView(false)}
                className='modal-view-request'
            >
                <div className='content-view-request'>
                    <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Tiêu đề:</div>
                        <div className='content-view-request-item-content'>{requestChoose.title}</div>
                    </div>
                    <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Nội dung:</div>
                        <div className='content-view-request-item-content'>{requestChoose.content}</div>
                    </div>
                    <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Ngày nhận:</div>
                        <div className='content-view-request-item-content'>{requestChoose.receivedAt}</div>
                    </div>
                    {/* <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Độ ưu tiên:</div>
                        <div className='content-view-request-item-content'>{requestChoose.priority}</div>
                    </div> */}
                    <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Lĩnh vực:</div>
                        <div className='content-view-request-item-content'>{requestChoose.category}</div>
                    </div>
                    <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Tình trạng:</div>
                        <div className='content-view-request-item-content'>{requestChoose.statusRequest}</div>
                    </div>
                    <div className='content-view-request-item'>
                        <div className='content-view-request-item-title'>Người tạo:</div>
                        <div className='content-view-request-item-content'>{requestChoose.people?.username}</div>
                    </div>
                    {
                        (requestChoose && requestChoose.process?.length > 1) &&
                        <div className='content-view-request-item'>
                            <div className='content-view-request-item-title'>Người chuyển tiếp:</div>
                            <div className='content-view-request-item-content'>{requestChoose.process[requestChoose.process.length - 1].people?.username}</div>
                        </div>
                    }
                </div>
            </Modal>
            <Modal
                title="Sửa kiến nghị"
                open={isOpenModalEdit}
                onOk={formEdit.submit}
                onCancel={() => setIsOpenModalEdit(false)}
                okText='Lưu'
                cancelText='Hủy'
            >
                <Form
                    name="editForm"
                    layout='vertical'
                    className='form-edit'
                    form={formEdit}
                    onFinish={handleFinishEditRequest}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!"
                            }
                        ]}
                    >
                        <Input placeholder='Nhập tiêu đề' />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="content"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập nội dung!"
                            }
                        ]}
                    >
                        <Input.TextArea placeholder='Nhập nội dung'
                            autoSize={{ minRows: 5, maxRows: 500 }}
                        />
                    </Form.Item>


                    <Form.Item
                        label="Độ ưu tiên"
                        name="priority"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn độ ưu tiên!"
                            }
                        ]}
                    >
                        <Select placeholder='Chọn độ ưu tiên' value={
                            requestChoose.priority
                        }>
                            <Select.Option value="1">1</Select.Option>
                            <Select.Option value="2">2</Select.Option>
                            <Select.Option value="3">3</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Lĩnh vực"
                        name="category"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn lĩnh vực!"
                            }
                        ]}
                    >
                        <Select placeholder='Chọn lĩnh vực' value={requestChoose.category}>
                            {lstCategory.map((item, index) => {
                                return (
                                    <Select.Option key={index} value={item.id}>{item.description}</Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Chuyển tiếp kiến nghị"
                open={isOpenModalForward}
                onOk={handleOkModalForward}
                onCancel={handleCloseModalForward}
                okText='Chuyển tiếp'
                cancelText='Hủy'

            >
                <Form
                    name="forwardForm"
                    layout='vertical'
                    className='form-forward'
                    form={formForward}
                >
                    <Form.Item
                        label="Người nhận"
                        name="persionForwardTo"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn người nhận!"
                            }
                        ]}
                    >
                        <Select
                            placeholder='Chọn người nhận'
                            style={{ width: '100%' }}
                        >
                            {lstUser.map((item, index) => {

                                if (item.id === userId) {
                                    return null;
                                }

                                return (
                                    <Select.Option key={index} value={item.id}>{item.username}</Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Hành động"
                        name="actionForward"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn người nhận!"
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            optionFilterProp='children'
                            placeholder='Chọn hành động'
                            style={{ width: '100%' }}
                        >
                            {lstAction.map((item, index) => {
                                return (
                                    <Select.Option key={index} value={item.id}>{item.actionName}</Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm kiến nghị"
                open={isOpenModalAdd}
                onOk={formAdd.submit}
                onCancel={closeAddBox}
                okText='Lưu'
                cancelText='Hủy'
            >
                <Form
                    name="editForm"
                    layout='vertical'
                    className='form-edit'
                    form={formAdd}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tiêu đề!"
                            }
                        ]}
                    >
                        <Input placeholder='Nhập tiêu đề' />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="content"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập nội dung!"
                            }
                        ]}
                    >
                        <Input.TextArea placeholder='Nhập nội dung'
                            autoSize={{ minRows: 5, maxRows: 500 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày nhận kiến nghị"
                        name="receivedAt"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày nhận kiến nghị!"
                            }
                        ]}
                    >
                        <Input type='date' />
                    </Form.Item>

                    <Form.Item
                        label="Lĩnh vực"
                        name="category"
                        className='form-item'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn lĩnh vực!"
                            }
                        ]}
                    >
                        <Select placeholder='Chọn lĩnh vực'>
                            {lstCategory.map((item, index) => (
                                <Select.Option key={index} value={item.id}>
                                    {item.description}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

const style = {
    rhs: {
        padding: '10px',
    },
    table: {
        marginTop: '10px',
    },
    header : {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
};


export default StaffView;