import { Button, Col, List, Space, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";
import { createActionBar } from "../../../common/util/actionBar";
import { createImgErrorHandler } from "../../../common/util/imgErrorHandler";
import { ReactComponent as LoadingIcon } from "./../../../common/images/loading.svg";
const { Title } = Typography;

export default function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const post = useSelector((state) => state.main.post);
  const hashtagCurrent = useSelector((state) => state.main.hashtagCurrent);
  const searchCurrent = useSelector((state) => state.main.searchCurrent);

  const { fetchStatus, isFetched, isSlow, nextPage, totalCount } = useFetchInfo(
    Types.FetchAllPost
  );

  // 액션바 생성함수 호출
  const actionBar = createActionBar();

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  useEffect(() => {
    let observer;
    if (targetRef.current) {
      // @ts-ignore
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          /**
           * 스크롤이 옵저버가 감시하는 지점이 도착했으며 FetchAllPost action의 상태가
           * undefined 거나 Success 일때만 새로운 리스트를 요청한다.
           * undefined는 첫 요청시에 호출되기 위하여 필요하다.
           * 첫 요청 후 FetchAllPost action의 상태는 Success로 변경된다.
           */
          if (
            entry.isIntersecting &&
            (fetchStatus === undefined || fetchStatus === FetchStatus.Success)
          ) {
            // 게시글 추가 조회
            dispatch(
              actions.fetchAllPost({
                post,
                totalCount,
                hashtag: hashtagCurrent,
                search: searchCurrent,
              })
            );
          }
        });
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [dispatch, post, totalCount, hashtagCurrent, searchCurrent, fetchStatus]);
  return (
    <>
      {searchCurrent && (
        <>
          <Space style={{ marginLeft: 30 }}>
            <Title level={5}>총</Title>
            <Title level={3} style={{ color: "#d8b48b" }}>
              {totalCount}
            </Title>
            <Title level={5}>개의 포스트를 찾았습니다.</Title>
          </Space>
        </>
      )}
      {nextPage >= 1 ? (
        <>
          {searchCurrent ? (
            <List
              className="main-list"
              grid={{
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
              }}
              itemLayout="vertical"
              size="large"
              dataSource={post}
              renderItem={(item) => (
                <>
                  <List.Item
                    className="main-list-item"
                    style={{ paddingTop: 30 }}
                    key={`post_${item.id}`}
                    actions={actionBar({ item, type: "default" })}
                  >
                    <Typography.Title>
                      <Link
                        to={`/blog/post/${item.id}`}
                        dangerouslySetInnerHTML={{
                          __html: item.sPostName,
                        }}
                      ></Link>
                    </Typography.Title>
                    <List.Item.Meta />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.sPostContent,
                      }}
                    ></div>
                    {item.Hashtags && (
                      <Col>
                        {item.Hashtags.map((item, i) => (
                          <Button
                            key={`button_${i}`}
                            className="tag-button"
                            type="primary"
                            shape="round"
                            style={{ marginTop: 10, marginRight: 10 }}
                          >
                            {item.hashtagName}
                          </Button>
                        ))}
                      </Col>
                    )}
                  </List.Item>
                </>
              )}
            />
          ) : (
            <List
              className="main-list"
              grid={{
                xs: 1,
                sm: 1,
                md: 1,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              itemLayout="vertical"
              size="large"
              dataSource={post}
              renderItem={(item) => (
                <>
                  <List.Item
                    className="main-list-item"
                    style={{ paddingTop: 30 }}
                    key={`post_${item.id}`}
                    actions={actionBar({ item, type: "default" })}
                  >
                    <div className="thumbnail-wrappper">
                      <div className="thumbnail">
                        <img
                          onClick={() => navigate(`/blog/post/${item?.id}`)}
                          style={{ cursor: "pointer" }}
                          alt="logo"
                          // 이미지를 가져올 때 postThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
                          src={`${
                            item?.postThumbnail &&
                            item?.postThumbnail !== "null"
                              ? `${API_HOST}/${item?.postThumbnail}`
                              : defaultImg
                          }`}
                          onError={handleImgError}
                        />
                      </div>
                    </div>
                    <Typography.Title>
                      <Link to={`/blog/post/${item.id}`}>{item.postName}</Link>
                    </Typography.Title>
                    <List.Item.Meta />
                    <Typography.Paragraph
                      style={{ minHeight: 66 }}
                      ellipsis={{
                        rows: 3,
                        expandable: false,
                      }}
                    >
                      {item.postDescription}
                    </Typography.Paragraph>
                    {item.Hashtags && (
                      <Col>
                        {item.Hashtags.map((item, i) => (
                          <Button
                            key={`button_${i}`}
                            className="tag-button"
                            type="primary"
                            shape="round"
                            style={{ marginTop: 10, marginRight: 10 }}
                          >
                            {item.hashtagName}
                          </Button>
                        ))}
                      </Col>
                    )}
                  </List.Item>
                </>
              )}
            />
          )}
        </>
      ) : (
        <LoadingIcon width={250} height={250} />
      )}
      {nextPage >= 1 && isSlow && !isFetched ? (
        <LoadingIcon width={250} height={250} />
      ) : (
        ""
      )}
      <div
        className="listPost"
        style={{ width: "100%", height: 10 }}
        ref={targetRef}
      />
    </>
  );
}
