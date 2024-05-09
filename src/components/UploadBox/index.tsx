import React, { use, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Alert, ConfigProvider, message, Spin, Upload } from 'antd';
import { Image, Space } from 'antd';
import { useEffect } from 'react';

const { Dragger } = Upload;

type Props = {
  onUploaded: any;
  onRemove: any;
  onLoading: any;
};

const UploadBox: React.FC<Props> = ({
  onUploaded,
  onRemove,
  onLoading,
}: Props) => {
  const [imageURL, setImageURL] = useState('');
  const [imageURLHeader, setImageURLHeader] = useState('');
  const [loading, setLoading] = useState(false);
  const [onImgHover, setOnImgHover] = useState(false);
  const [onPreview, setOnPreview] = useState(false);

  useEffect(() => {
    if (imageURL) {
      onUploaded(imageURL);

      fetch(imageURL, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      })
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImageURLHeader(url);
        })
        .catch(error => console.error('Failed to load image:', error));
    }
  }, [imageURL]);

  const props: UploadProps = {
    //wait for API
    name: 'file',
    accept: '.png,.jpg,.jpeg',
    multiple: false,
    maxCount: 1,
    action: 'https://4349-171-101-104-145.ngrok-free.app/file/',
    onPreview(info) {
      console.log(info);
      setOnPreview(true);
    },
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    onChange(info) {
      // setLoading(true);
      onLoading(true);
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        // setLoading(false);
        onLoading(false);
        setImageURL(info.file.response.image_url);
        console.log(imageURL);
      } else if (status === 'error') {
        // setLoading(false);
        onLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
      if (status === 'removed') {
        message.success(`${info.file.name} file is successfully removed.`);
        setImageURL('');
        // setLoading(false);
        onLoading(false);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove() {
      onRemove();
      setImageURL('');
      setImageURLHeader('');
    },
  };

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
      <Dragger {...props} disabled={onImgHover || onPreview}>
        <Spin spinning={loading} size="large">
          {!imageURL ? (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined className="!text-white" />
              </p>
              <p className="ant-upload-text font-medium">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single upload. Be cautious and refrain from
                uploading company data or other banned files.
              </p>
            </>
          ) : (
            <Space>
              <Image
                width={200}
                src={imageURLHeader}
                onMouseEnter={() => setOnImgHover(true)}
                onMouseLeave={() => setOnImgHover(false)}
                preview={{
                  visible: onPreview,
                  onVisibleChange: visible => setOnPreview(visible),
                  afterOpenChange: visible => !visible && setOnPreview(false),
                }}
              />
            </Space>
          )}
        </Spin>
      </Dragger>
    </ConfigProvider>
  );
};

export default UploadBox;
