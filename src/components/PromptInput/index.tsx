import { CopyOutlined } from '@ant-design/icons';
import { Button, Input, Space, message } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { useState } from 'react';

type InputPromptProps = {
  placeholder?: string;
  HasButton?: boolean;
  value?: string;
  onChange?: any;
  size?: SizeType;
  disabled?: boolean;
};

const PromptInput: React.FC<InputPromptProps> = ({
  placeholder,
  HasButton,
  value,
  onChange,
  size = 'middle',
  disabled = false,
}: InputPromptProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const submit = () => {
    console.log(value);
    navigator.clipboard.writeText(value as string);
    messageApi.open({
      type: 'success',
      content: 'Copied to clipboard!',
    });
  };
  return (
    <Space.Compact style={{ width: '100%' }}>
      {contextHolder}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        size={size}
        disabled={disabled}
        className="h-auto"
      />
      {HasButton ? (
        <Button
          size={size}
          onClick={submit}
          className="grid place-items-center group"
        >
          <CopyOutlined className="opacity-30" />
        </Button>
      ) : (
        <></>
      )}
    </Space.Compact>
  );
};

export default PromptInput;
