import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
  LockOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  message,
  Upload,
  Modal,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Content, Footer } from "antd/lib/layout/layout";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "../../../common/components/Icon";
import { API_HOST, FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { actions as common } from "../../../common/state";
import { Types as mainType, actions as mainActions } from "../../main/state";

export default function WriteSetting({
  setLevel,
  hashtag,
  postContent,
  postName,
  postThumbnail,
  postThumbnailId,
  postDescription,
  postPermission,
  series,
  postId,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goBlog = useCallback(() => {
    navigate("/blog");
  }, [navigate]);

  const [isSeriesADD, setIsSeriesADD] = useState(false);
  const [seriesInput, setSeriesInput] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);
  const seriesList = useSelector((state) => state.write.seriesList);
  const [seriesSelectYsno, setSeriesSelectYsno] = useState(false);
  const [prev, setPrev] = useState("");
  const spanRefs = useRef({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const permission = useSelector(state => state.write.permission);
  const description = useSelector(state => state.write.postDescription);
  const seriesName = useSelector(state => state.write.seriesName);
  const imageList = useSelector(state => state.write.imageList);
  const thumbnail = useSelector(state => state.write.postThumbnail);
  const thumbnailId = useSelector(state => state.write.thumbnailId);
  const tempId = useSelector(state => state.write.tempId);

  const { fetchStatus: cfetchStatus, isFetching: cisFetching } = useFetchInfo(Types.FetchCreatePost);
  const { fetchStatus: ufetchStatus, isFetching: uisFetching } = useFetchInfo(Types.FetchUpdatePost);
  const { fetchStatus: tfetchStatus, isFetching: tisFetching } = useFetchInfo(Types.FetchCreateTempPost);
  const key = "updatable";

  const deleteStatus = useCallback(
    (actionType, fetchKey) => {
      if (!fetchKey) fetchKey = actionType;
      const params = {
        actionType,
        fetchKey,
        status: FetchStatus.Delete,
      };
      dispatch(common.setFetchStatus(params));
    },
    [dispatch]
  );

  const openMessage = useCallback(
    (status) => {
      if (status === FetchStatus.Success) {
        message.success({
          content: "????????? ?????????????????????",
          key,
          duration: 2,
        });
        setTimeout(() => {
          goBlog();
        }, 500);
      } else if (status === FetchStatus.Success) {
        message.error({
          content: "?????? ??? ????????? ??????????????????",
          key,
          duration: 2,
        });
      } else if (status === FetchStatus.Request) {
        message.loading({
          content: "?????????",
          key,
        });
      }
    },
    [goBlog]
  );

  const openTempMessage = useCallback(
    (status) => {
      if (status === FetchStatus.Success) {
        message.success({
          content: "??????????????? ?????????????????????",
          key,
          duration: 2,
        });
        deleteStatus(Types.FetchCreateTempPost);
        setTimeout(() => {
          goBlog();
        }, 500);
      } else if (status === FetchStatus.Success) {
        message.error({
          content: "???????????? ??? ????????? ??????????????????",
          key,
          duration: 2,
        });
      } else if (status === FetchStatus.Request) {
        message.loading({
          content: "?????????",
          key,
        });
      }
    },
    [goBlog]
  );

  /* ?????????????????? 2??? ???????????? ?????? */
  useEffect(() => {
    if (thumbnail && thumbnailId) {
      setDefaultFileList([{
        name: thumbnail,
        thumbUrl: `${API_HOST}/${thumbnail}`,
      }]);
      setPreviewImage({
        fileName: thumbnail,
        id: thumbnailId,
      });
    }
    if (seriesName) {
      setSeriesSelectYsno(true);
      if (seriesList?.length) {
        setPrev(seriesName);
      }
    }
  }, [])

  /* ????????? ?????? ????????? ????????? */
  useEffect(() => {
    if (!postId) {
      if (cfetchStatus === FetchStatus.Request) {
        openMessage(cfetchStatus);
      }
      if (cfetchStatus !== FetchStatus.Request) {
        openMessage(cfetchStatus);
      }
    }
  }, [cfetchStatus, openMessage]);

  /* ????????? ?????? ????????? ????????? */
  useEffect(() => {
    if (postId) {
      if (ufetchStatus === FetchStatus.Request) {
        openMessage(ufetchStatus);
      }
      if (ufetchStatus !== FetchStatus.Request) {
        openMessage(ufetchStatus);
      }
    }
  }, [ufetchStatus, openMessage]);

  /*  */
  const handleCancel = () => setPreviewOpen(false);

  /* ???????????? ?????? ?????? ????????? */
  const handlePreview = async () => {
    setPreviewOpen(true);
  };

  /* ???????????? ??? ?????? */
  useEffect(() => {
    return () => {
      deleteStatus(Types.FetchCreatePost);
      deleteStatus(Types.FetchUpdatePost);
      deleteStatus(mainType.FetchAllPost);
      deleteStatus(mainType.FetchAllHashtag);
      deleteStatus(mainType.FetchAllSeries);
      dispatch(mainActions.setValue('post', []));
    }
  }, [])

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  /* ????????? ????????? ????????? ????????? */
  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const url = `${API_HOST}/image`;
    const method = "post";
    const fmData = new FormData();
    fmData.append("image", file);
    try {
      const res = await axios({
        url,
        method,
        data: fmData,
        withCredentials: true,
      });
      onSuccess(res.data);
      console.log("server res: ", res);
    } catch (err) {
      console.log("Eroor: ", err);
      onError({ err });
    }
  };

  /* ????????? ????????? ?????? ??? ?????? ????????? */
  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
    setPreviewImage(fileList?.[0]?.response);
    dispatch(actions.setValue('postThumbnail', fileList?.[0]?.response?.fileName))
    if (fileList?.[0]?.response?.id) {
      dispatch(actions.setValue('thumbnailId', fileList?.[0]?.response?.id));
    }
  };

  /* ????????? ?????? ????????? */
  const handleOnRemove = () => {
    dispatch(actions.setValue('thumbnailId', ""));
  };

  const uploadButton = (
    <div>
      <p className="ant-upload-drag-icon">
        <ImageIcon style={{ height: 180, display: "block" }} />
      </p>
      <p>
        <Button
          style={{ marginBottom: 15 }}
          className="button-type-round button-color-normal button-size-large"
        >
          ????????? ?????????
        </Button>
      </p>
    </div>
  );

  /* ???????????? ????????? ?????? ????????? */
  const onSeriesChange = (target) => {
    dispatch(actions.setValue('seriesName', target.target.value));
  };

  /* ????????? ????????? ????????? ?????? ????????? */
  const onSeriesCancel = () => {
    dispatch(actions.setValue('seriesName', null));
  };

  /* ????????? ?????? ??? ?????? ?????? */
  const addSeries = () => {
    if (seriesInput) {
      const selected = spanRefs?.current[seriesInput];
      if (!selected && seriesInput !== "") {
        dispatch(actions.fetchCreateSeries(seriesInput));
      } else {
        spanRefs.current[seriesInput].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
      dispatch(actions.setValue('seriesName', seriesInput));
    }
    setSeriesInput("");
    setPrev(seriesInput);
  };

  /* ?????? ?????? ???????????? ????????????. */
  useEffect(() => {
    dispatch(actions.fetchAllSeries());
  }, [dispatch]);


  /* ????????? ?????? ??? ???????????? ?????? ????????? ????????? ???????????????. ( ?????? / ?????? ??? ?????? ) */
  useEffect(() => {
    if (Object.keys(spanRefs).length !== 0 && prev) {
      if (spanRefs.current[prev]) {
        spanRefs.current[prev].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [seriesList, prev]);

  /* ???????????? */
  function tempSubmit({ description, permission, seriesName }) {
    let imageIds = [];
    let hashtags = [];
    if (imageList?.length > 0) {
      imageIds = [...imageList];
    }
    if (thumbnailId) {
      imageIds.push(thumbnailId);
    }
    if (hashtag) {
      hashtag.map((item) => {
        return hashtags.push(item.key);
      });
    }
    dispatch(
      actions.fetchCreateTempPost({
        postId: postId,
        postName: postName,
        hashtags: hashtags,
        postDescription: description,
        postContent: postContent,
        postThumbnail: `${thumbnail ?? null}`,
        permission: permission,
        seriesName: seriesName,
        imageIds: imageIds,
      })
    );
  }

  /* ?????? ?????? ????????? */
  useEffect(() => {
    if (!postId) {
      if (tfetchStatus === FetchStatus.Request) {
        openTempMessage(tfetchStatus);
      }
      if (tfetchStatus !== FetchStatus.Request) {
        openTempMessage(tfetchStatus);
      }
    }
  }, [tfetchStatus, openTempMessage]);

  /* ?????? ??? ?????? ?????? */
  useEffect(() => {
    if (postPermission) dispatch(actions.setValue('permission', postPermission));
    if (postDescription) dispatch(actions.setValue('postDescription', postDescription));
    if (series?.seriesName) {
      setSeriesSelectYsno(true);
      if (seriesList?.length) {
        dispatch(actions.setValue('seriesName', series?.seriesName));
        setPrev(series?.seriesName);
      }
    }
    if (postThumbnail && postThumbnail !== "null") {
      setDefaultFileList([{
        name: postThumbnail,
        thumbUrl: `${API_HOST}/${postThumbnail}`,
      }]);
      setPreviewImage({
        fileName: postThumbnail,
        id: postThumbnailId,
      });
      dispatch(actions.setValue('thumbnailId', postThumbnailId));
      dispatch(actions.setValue('postThumbnail', postThumbnail))
    }
  }, [dispatch, postThumbnail, postDescription, series, seriesList, postPermission, postThumbnailId])

  return (
    <>
      <motion.div
        className="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.div layoutId={`item-motion`}>
          <div className="content content-detail">
            <Content
              className={`main-content main-writer main-writer-detail ${isSeriesADD ? "isSeriesADD" : ""
                }`}
              style={{
                display: "flex",
                alignItems: "center",
                overflowY: "auto",
              }}
            >
              <Row
                className="sub-content"
                style={{
                  paddingTop: 15,
                  paddingBottom: 15,
                  overflow: "hidden",
                }}
              >
                <Col>
                  <Typography.Title level={3}>????????? ????????????</Typography.Title>
                  <Upload
                    accept="image/*"
                    customRequest={uploadImage}
                    onChange={handleOnChange}
                    listType="picture-card"
                    fileList={defaultFileList}
                    className="image-upload-grid"
                    onPreview={handlePreview}
                    beforeUpload={beforeUpload}
                    onRemove={handleOnRemove}
                  >
                    {defaultFileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title="????????????"
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={`${API_HOST}/${previewImage?.fileName}`}
                    />
                  </Modal>
                  <Typography.Title level={3} style={{ marginTop: 30 }}>
                    ????????? ??????
                  </Typography.Title>
                  <TextArea
                    defaultValue={postDescription ?? description ?? ''}
                    showCount
                    maxLength={100}
                    onChange={(e) => {
                      dispatch(actions.setValue('postDescription', e.target.value))
                    }}
                  />
                </Col>
                <div className="vertical-line" />
                {!isSeriesADD && (
                  <Col>
                    <Typography.Title level={3}>?????? ??????</Typography.Title>
                    <Radio.Group
                      defaultValue={postPermission ?? 'public'}
                      onChange={(e) => {
                        dispatch(actions.setValue('permission', e.target.value));
                      }}
                      value={permission}
                      className="permission"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: 30,
                      }}
                    >
                      <Radio.Button
                        value="public"
                        style={{
                          width: 140,
                          height: 50,
                          display: "flex",
                          marginRight: 10,
                        }}
                      >
                        <GlobalOutlined /> ????????????
                      </Radio.Button>
                      <Radio.Button
                        value="private"
                        style={{ width: 140, height: 50, display: "flex" }}
                      >
                        <LockOutlined /> ?????????
                      </Radio.Button>
                    </Radio.Group>
                    {!seriesSelectYsno && (
                      <>
                        <Typography.Title level={3}>
                          ????????? ??????
                        </Typography.Title>
                        <Button
                          icon={<AppstoreAddOutlined />}
                          style={{
                            height: 50,
                            fontSize: 20,
                          }}
                          className="button-type-round width-full"
                          onClick={() => setIsSeriesADD(!isSeriesADD)}
                        >
                          ???????????? ????????????
                        </Button>
                      </>
                    )}
                    {seriesSelectYsno && (
                      <>
                        <Typography.Title level={3}>
                          ????????? ??????
                        </Typography.Title>
                        <Input.Group compact>
                          <Input
                            className="seires-input-selected"
                            disabled
                            value={seriesName}
                            addonAfter={
                              <Button
                                className="seires-button-selected"
                                icon={<SettingOutlined />}
                                onClick={() => {
                                  setIsSeriesADD(!isSeriesADD);
                                  setSeriesSelectYsno(!seriesSelectYsno);
                                  setSeriesInput("");
                                  dispatch(actions.setValue('seriesName', null));
                                }}
                              />
                            }
                          />
                        </Input.Group>
                      </>
                    )}
                  </Col>
                )}
                {isSeriesADD && (
                  <Col style={{ display: "flex", flexDirection: "column" }}>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Title
                        level={3}
                        style={{ display: "inline", width: 120, fontSize: 20 }}
                      >
                        ????????? ??????
                      </Typography.Title>
                      <Space className="seriesTopButton">
                        <Button
                          style={{ fontWeight: 700 }}
                          className="button-border-hide button-type-round"
                          onClick={() => {
                            setSeriesInput("");
                            setIsSeriesADD(!isSeriesADD);
                            onSeriesCancel();
                          }}
                        >
                          ??????
                        </Button>
                        <Button
                          disabled={!seriesName}
                          className="button-type-round button-color-reverse"
                          onClick={() => {
                            setSeriesSelectYsno(true);
                            setIsSeriesADD(!isSeriesADD);
                          }}
                        >
                          ????????????
                        </Button>
                      </Space>
                    </Col>
                    <div
                      className="inputBox"
                      style={{ padding: 15, backgroundColor: "#f8f9fb" }}
                    >
                      <Input
                        onBlur={() => {
                          setInputFocus(!inputFocus);
                        }}
                        onFocus={() => {
                          setInputFocus(!inputFocus);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addSeries(); // Enter ????????? ?????? ?????? ????????? ??????
                          }
                        }}
                        style={{
                          border: 0,
                        }}
                        value={seriesInput}
                        onChange={(e) => {
                          setSeriesInput(e.target.value);
                        }}
                        placeholder="????????? ????????? ????????? ???????????????"
                      />
                      <AnimatePresence>
                        {inputFocus && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div layoutId={`button_1`}>
                              <Button
                                className="button-type-round button-color-reverse"
                                onClick={addSeries}
                                style={{ marginTop: 20 }}
                              >
                                ????????? ??????
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {seriesList && (
                      <Radio.Group
                        className="series-group"
                        onChange={(target) => {
                          onSeriesChange(target);
                        }}
                        value={seriesName}
                        style={{
                          width: "100%",
                          maxHeight: 265,
                          overflow: "auto",
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          {seriesList.map((item, index) => {
                            return (
                              <Radio.Button
                                style={{ width: "100%", borderRadius: 0 }}
                                key={item.seriesName}
                                value={item.seriesName}
                              >
                                {item.seriesName}
                                <span
                                  ref={(element) =>
                                  (spanRefs.current[item.seriesName] =
                                    element)
                                  }
                                />
                              </Radio.Button>
                            );
                          })}
                        </Space>
                      </Radio.Group>
                    )}
                    <Footer
                      className="seriesBottomButton"
                      style={{
                        backgroundColor: "white",
                        marginTop: "auto",
                      }}
                    >
                      <Space>
                        <Button
                          style={{ fontWeight: 700 }}
                          className="button-border-hide button-type-round"
                          onClick={() => {
                            setSeriesInput("");
                            setIsSeriesADD(!isSeriesADD);
                            onSeriesCancel();
                          }}
                        >
                          ??????
                        </Button>
                        <Button
                          disabled={!seriesName}
                          className="button-type-round button-color-reverse"
                          onClick={() => {
                            setSeriesSelectYsno(true);
                            setIsSeriesADD(!isSeriesADD);
                          }}
                        >
                          ????????????
                        </Button>
                      </Space>
                    </Footer>
                  </Col>
                )}
              </Row>
            </Content>
            <Footer className="main-footer" style={{ zIndex: 1 }}>
              <Row>
                <Col flex="auto">
                  <Button
                    style={{ fontWeight: 700 }}
                    className="button-border-hide button-type-round"
                    icon={<ArrowLeftOutlined />}
                    disabled={cisFetching}
                    onClick={() => {
                      setLevel(0);
                    }}
                  >
                    ?????????
                  </Button>
                </Col>
                <Col flex="168px">
                  <Space>
                    <Button
                      style={{ fontWeight: 700 }}
                      className="button-border-hide button-type-round"
                      disabled={cisFetching}
                      onClick={() => tempSubmit({ description, permission, seriesName })}
                    >
                      ????????????
                    </Button>
                    <Button
                      className="button-type-round button-color-reverse"
                      disabled={cisFetching || uisFetching}
                      onClick={() => {
                        let imageIds = [];
                        let hashtags = [];
                        if (imageList?.length > 0) {
                          imageIds = [...imageList];
                        }
                        if (previewImage) {
                          imageIds.push(thumbnailId);
                        }
                        if (hashtag) {
                          hashtag.map((item) => {
                            return hashtags.push(item.key);
                          });
                        }
                        if (postId) {
                          dispatch(
                            actions.fetchUpdatePost({
                              postId: postId,
                              postName: postName,
                              hashtags: hashtags,
                              postDescription: description,
                              postContent: postContent,
                              postThumbnail: `${previewImage?.fileName ?? ''}`,
                              permission: permission,
                              seriesOriId: series?.id,
                              seriesOriName: series?.seriesName,
                              seriesName: seriesName,
                              imageIds: imageIds,
                              tempId: tempId,
                            })
                          );
                        } else {
                          dispatch(
                            actions.fetchCreatePost({
                              postName: postName,
                              hashtags: hashtags,
                              postDescription: description,
                              postContent: postContent,
                              postThumbnail: `${previewImage?.fileName ?? null}`,
                              permission: permission,
                              seriesName: seriesName,
                              imageIds: imageIds,
                              tempId: tempId,
                            })
                          );
                        }
                      }}
                    >
                      ????????????
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Footer>
          </div>
        </motion.div>{" "}
      </motion.div>
    </>
  );
}
