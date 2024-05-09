import { Button, Input, Select, Space } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Dispatch, SetStateAction, useState } from 'react';

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
  const [valueSubmitted, setValueSubmitted] = useState(false);

  const submit = () => {
    console.log('submit users input');
    setValueSubmitted(true);
    setTimeout(() => {
      setValueSubmitted(false);
      console.log('finish loading input to system');
    }, 3000);
  };
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        size={size}
        disabled={disabled}
        className="h-auto"
      />
      {HasButton ? (
        <Button type="primary" onClick={submit} loading={valueSubmitted}>
          Submit
        </Button>
      ) : (
        <></>
      )}
    </Space.Compact>
  );
};

export default PromptInput;
