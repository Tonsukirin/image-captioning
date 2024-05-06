import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { ConfigProvider, message, Upload } from 'antd';

const { Dragger } = Upload;

const props: UploadProps = {
  //wait for API
  name: 'file',
  accept: '.png,.jpg,.jpeg',
  multiple: false,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const UploadBox: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: 'white',
          colorTextDescription: 'white',
          colorPrimaryHover: '#40444b',
        },
      }}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="!text-white" />
        </p>
        <p className="ant-upload-text font-medium">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
    </ConfigProvider>
  );
};

export default UploadBox;
