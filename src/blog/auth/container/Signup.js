import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AuthLayout from "../component/AuthLayout";
import {
  Input,
  Button,
  Form,
  Card,
  Typography,
  Select,
  message,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions, Types } from "../state";
import { actions as common } from "../../../common/state";
import useBlockLoginUser from "../hook/useBlockLoginUser";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { FetchStatus } from "../../../common/constant";
import banner from "./../../../common/images/loginBanner.png";

export default function Signup() {
  useBlockLoginUser();
  const dispatch = useDispatch();
  const { fetchStatus } = useFetchInfo(Types.FetchEmail);
  function onFinish() {
    let email = "";

    if (!selfSelect) {
      email = `${id}@${selectedOption}`;
    } else {
      email = `${id}@${selfSelect}`;
    }
    dispatch(actions.fetchEmail(email));
  }

  const navigate = useNavigate();

  const selectAfter = <>@</>;

  const defaultSelect = "naver.com";

  const [selectedOption, setSelectedOption] = useState(defaultSelect);
  const [selfSelect, setSelfSelect] = useState("");
  const [id, setId] = useState("");
  const selectRef = useRef(null);

  useLayoutEffect(() => {
    if (selectRef.current != null) selectRef.current.focus();
  });

  const key = "mailSend";

  useEffect(() => {
    if (fetchStatus === FetchStatus.Success) {
      message.success({
        content: "회원가입 메일이 발송되었습니다",
        key,
        duration: 2,
      });
      dispatch(
        common.setFetchStatus({
          actionType: Types.FetchEmail,
          fetchKey: Types.FetchEmail,
          status: FetchStatus.Delete,
        })
      );
    } else if (fetchStatus === FetchStatus.Request) {
      message.loading({
        content: "처리중",
        key,
        duration: 2,
      });
    }
  }, [fetchStatus, dispatch]);

  return (
    <AuthLayout onFinish={onFinish}>
      <Card
        style={{
          width: "20rem",
        }}
        cover={
          <img
            onClick={() => navigate('/blog')}
            alt="example"
            src={banner}
          />
        }
        actions={[
          // <Typography.Text>비밀번호 찾기</Typography.Text>,
          <Typography.Text onClick={() => navigate("/blog/login")} style={{ fontWeight: 'bold' }}>
            로그인
          </Typography.Text>,
        ]}
      >
        <Space style={{ display: "flex" }} size={0}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "이메일을 입력하세요!",
              },
            ]}
          >
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              addonAfter={selectAfter}
              placeholder=""
            />
          </Form.Item>
          <Form.Item>
            {selectedOption !== "selfSelect" && (
              <Select
                defaultValue={defaultSelect}
                style={{ width: 120, minWidth: 120, height: "32.19px" }}
                onChange={(e) => setSelectedOption(e)}
                options={[
                  {
                    value: "naver.com",
                    label: "naver.com",
                  },
                  {
                    value: "daum.net",
                    label: "daum.net",
                  },
                  {
                    value: "gmail.com",
                    label: "gmail.com",
                  },
                  {
                    value: "selfSelect",
                    label: "직접선택",
                  },
                ]}
              />
            )}
          </Form.Item>
          <Form.Item>
            {selectedOption === "selfSelect" && (
              <Input
                ref={selectRef}
                value={selfSelect}
                onChange={(e) => setSelfSelect(e.target.value)}
                onBlur={() => {
                  if (selfSelect === "") setSelectedOption(defaultSelect);
                }}
                style={{ width: 120, minWidth: 120, height: "32.19px" }}
                placeholder="직접 입력하세요."
              />
            )}
          </Form.Item>
        </Space>
        <Form.Item>
          <Button
            className="button-type-round button-color-reverse"
            htmlType="submit"
            style={{
              width: "100%",
              fontSize: 20,
              height: 48,
              border: "1px solid #f8f9fb",
            }}
          >
            인증 메일 받기
          </Button>
        </Form.Item>
      </Card>
    </AuthLayout>
  );
}
