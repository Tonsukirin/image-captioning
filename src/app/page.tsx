'use client';

import PromptInput from '@/components/PromptInput';
import UploadBox from '@/components/UploadBox';
import { Button, Form, FormProps, Skeleton, Spin, notification } from 'antd';
import { useEffect, useState } from 'react';
import Typewriter from '@/typewriter-effect/dist/react';
import GraphemeSplitter from 'grapheme-splitter';

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

  const formReset = () => {
    setCaptionStatus('waiting');
    setImageURL('');
  };

  useEffect(() => {
    console.log('change');
    if (imageURL) {
      setCaptionStatus('waiting');
    }
  }, [imageURL]);

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
      const response = await fetch(
        'https://53a3-171-101-104-145.ngrok-free.app/captions/',
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
          body: formData,
        }
      );

      if (!response.ok) {
        response.json().then(errorDetails => {
          if (errorDetails.detail.error === 'Profanity detected') {
            notification.warning({
              message: 'Profanity detected!',
              description: `Profanity detected in "${errorDetails.detail.fields.map(
                (field: string) => field
              )}" field`,
              duration: 3,
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
        duration: 3,
      });
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Submission Failed',
        description: 'There was a problem submitting your form.',
        duration: 3,
      });
    } finally {
      setLoading(false); // Reset loading state whether success or failure
    }
  };

  const renderCaption = () => {
    switch (captionStatus) {
      case 'waiting':
        return;
      case 'selecting':
        return captions.map((caption, idx) => {
          return (
            <div className="mb-2" key={idx}>
              <p className="text-white mb-1">Select caption {idx + 1}:</p>
              <Button
                className="w-full text-left whitespace-normal text-pretty break-normal break-words h-auto"
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

                    stringSplitter: (text: string) => {
                      const splitter = new GraphemeSplitter();
                      return splitter.splitGraphemes(checkString(text));
                    },
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
    <main className="flex flex-col items-center break-all">
      {loading && (
        <Spin
          spinning={loading}
          size="large"
          tip={
            <Typewriter
              options={{
                strings: 'Loading...',
                autoStart: true,
                delay: 5,
                loop: true,
                cursor: ' ✈',
                skipAddStyles: true,
              }}
            />
          }
          fullscreen
          className="flex justify-center items-center h-full"
        />
      )}
      <div className="flex flex-col p-4 m-20 font-thin min-w-[60%] mx-auto gap-y-2 w-full lg:w-auto">
        <UploadBox
          onUploaded={setImageURL}
          onRemove={() => formReset()}
          onLoading={setLoading}
        />
        {imageURL ? (
          <Form onFinish={onFinish}>
            <div className="w-full mb-0 mt-2">{renderCaption()}</div>
            {captionStatus === 'waiting' && (
              <div>
                <p className="text-white mb-1">Optional</p>
                <div className="flex flex-col md:flex-row justify-evenly gap-x-4">
                  <Form.Item<FieldType> className="w-full" name="theme">
                    <PromptInput
                      placeholder="Theme prompts here..."
                      disabled={loading}
                    />
                  </Form.Item>
                  <Form.Item<FieldType>
                    className="w-full"
                    name="additionalInfo"
                  >
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
              </div>
            )}
            {captionStatus === 'waiting' && (
              <Form.Item wrapperCol={{ span: 16 }}>
                <Button
                  className="bg-black"
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
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
            <div className="flex mt-1 gap-x-4">
              <Button
                className="bg-black"
                type="primary"
                loading={loading}
                htmlType="button"
                onClick={() => setCaptionStatus('waiting')}
              >
                Regenerate Caption
              </Button>
              <Button
                className="bg-black"
                type="primary"
                loading={loading}
                htmlType="button"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Start over
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
