import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import QRCode from "qrcode.react";
import { BACKEND_ADDR, CODE } from "../config";
import { barrierSelector } from "../store/barrier";
import actions from "../store/actions";

export const MainScreen: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.barrier.connect("CE"));
  });

  const open = useSelector(barrierSelector);

  const code = JSON.stringify({
    node: BACKEND_ADDR,
    code: CODE,
  });

  return (
    <Container
      fluid
      style={{
        flex: 1,
        width: "100vh",
        height: "100vh",
      }}
    >
      <Row>
        <Col sm={6} lg={6} xs={6} md={6}>
          <h1>Parking SV</h1>
          <QRCode value={code} />
        </Col>
        <Col sm={6} lg={6} xs={6} md={6}>
          {open.open ? "Open" : "Close"}
        </Col>
      </Row>
    </Container>
  );
};
