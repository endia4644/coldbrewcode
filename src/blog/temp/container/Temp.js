import { Col, Divider, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions as authActions } from "../../auth/state";
import { actions as commonActions } from "../../../common/state";
import { actions, Types } from "../state";
import { Content, Header } from "antd/lib/layout/layout";
import Settings from "../../main/components/Settings";
import Post from "../components/Post";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import { FetchStatus } from "../../../common/constant";

export default function Temp() {
  useNeedLogin();
  const dispatch = useDispatch();

  function logout() {
    dispatch(authActions.fetchLogout());
  }

  useEffect(() => {
    return () => {
      dispatch(commonActions.setFetchStatus({
        actionType: Types.FetchAllPost,
        status: FetchStatus.Delete,
      }));
      dispatch(actions.setValue('post', []));
    }
  }, [])

  return (
    <>
      <Header className="site-layout-background main-header fix-menu">
        <Row justify="end">
          <Col>
            <Settings logout={logout} />
          </Col>
        </Row>
      </Header>
      <Content className="post-wrap main-content">
        <Typography.Title level={3}>μμκΈ</Typography.Title>
        <Divider />
        <Post />
      </Content>
    </>
  );
}