'use client';

import PromptInput from '@/components/PromptInput';
import UploadBox from '@/components/UploadBox';
import { Button, Form, FormProps, notification } from 'antd';
import { useState } from 'react';
import Typewriter from 'typewriter-effect';

type FieldType = {
  theme?: string;
  additionalInfo?: string;
  tone?: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [captionStatus, setCaptionStatus] = useState<
    'waiting' | 'selecting' | 'selected'
  >('waiting');
  const [selectedCaption, setSelectedCaption] = useState('');
  const [captions, setCaptions] = useState<string[]>([]);

  const checkString = (str: string) => {
    if (str.startsWith('"') || str.endsWith('"')) {
      str = str.slice(1, -1);
      return str;
    } else {
      return str;
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async values => {
    setLoading(true);
    const formData: FormData = new FormData();
    formData.append('image_url', (imageURL as string) ?? '');
    formData.append('theme', (values.theme as string) ?? '');
    formData.append('tone', (values.tone as string) ?? '');
    formData.append(
      'additional_context',
      (values.additionalInfo as string) ?? ''
    );

    for (var pair of formData.entries() as any) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/captions/', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      });

      if (!response.ok) {
        response.json().then(errorDetails => {
          if (errorDetails.detail.error === 'Profanity detected') {
            notification.warning({
              message: 'Profanity detected!',
              description: `Profanity detected in "${errorDetails.detail.fields.map(
                (field: string) => field
              )}" field`,
            });
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        });
      }

      const result = await response.json();
      console.log(result.captions);
      setCaptions(result.captions);
      setCaptionStatus('selecting');
      notification.success({
        message: 'Form Submitted',
        description: 'Your form has been successfully submitted.',
      });
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Submission Failed',
        description: 'There was a problem submitting your form.',
      });
    } finally {
      setLoading(false); // Reset loading state whether success or failure
    }
  };

  const renderCaption = () => {
    switch (captionStatus) {
      case 'waiting':
        return (
          <div>
            <p className="text-white mb-1">Social Media Caption Generator</p>
            <PromptInput value="GENERATED CAPTION WILL BE DISPLAYED HERE" />
          </div>
        );

      case 'selecting':
        return captions.map((caption, idx) => {
          return (
            <div className="mb-2" key={idx}>
              <p className="text-white mb-1">Select caption {idx + 1}:</p>
              <Button
                className="w-full text-left"
                size="large"
                onClick={() => {
                  setCaptionStatus('selected');
                  setSelectedCaption(caption);
                }}
              >
                <Typewriter
                  options={{
                    strings: checkString(caption),
                    autoStart: true,
                    delay: 10,
                  }}
                />
              </Button>
            </div>
          );
        });
      case 'selected':
        return (
          <div>
            <p className="text-white mb-1">Generated Caption:</p>
            <PromptInput value={checkString(selectedCaption)} size="large" />
          </div>
        );
      default:
        return;
    }
  };

  return (
    <main className="flex flex-col m-20 font-thin gap-y-4 max-w-screen-2xl mx-auto">
      <UploadBox onUploaded={setImageURL} onRemove={setImageURL} />
      {imageURL ? (
        <Form onFinish={onFinish}>
          <Form.Item<FieldType> className="w-full mb-0">
            {renderCaption()}
          </Form.Item>
          {captionStatus === 'waiting' && (
            <div className="mt-4 flex flex-grow justify-evenly gap-x-4 ">
              <Form.Item<FieldType> className="w-full" name="theme">
                <PromptInput
                  placeholder="Theme prompts here..."
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item<FieldType> className="w-full" name="additionalInfo">
                <PromptInput
                  placeholder="Additional Information prompts here..."
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item<FieldType> className="w-full" name="tone">
                <PromptInput
                  placeholder="Tone prompts here..."
                  disabled={loading}
                />
              </Form.Item>
            </div>
          )}
          {captionStatus === 'waiting' && (
            <Form.Item wrapperCol={{ span: 16 }}>
              <Button
                className="bg-black"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          )}
        </Form>
      ) : (
        <></>
      )}
      <div>
        {captionStatus === 'selected' && (
          <Button
            className="bg-black"
            type="primary"
            loading={loading}
            htmlType="button"
            onClick={() => setCaptionStatus('waiting')}
          >
            Regenerate Caption
          </Button>
        )}
      </div>
    </main>
  );
}
