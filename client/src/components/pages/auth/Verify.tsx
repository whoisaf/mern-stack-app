import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";

import * as routes from "../../../constants/routes";
import { dictionary } from "../../../data";
import { useVerify } from "../../../hooks";
import { sanitize } from "../../../utils";
import { IPageProps, Page } from "../../hoc/Page";
import { Logo, Preloader } from "../../ui";

const Verify: React.FC<IPageProps> = ({ isAuthenticated }) => {
  /**
   *  Get token from URL params
   */
  const { token } = useParams();

  /**
   *  Verify api
   */
  const verify = useVerify(token);

  /**
   *  Redirect if authenticated
   */
  if (isAuthenticated) {
    return <Redirect to={routes.DASHBOARD} />;
  }

  /**
   *  Render
   */
  return (
    <Page title={dictionary.AUTH_VERIFY_TITLE} classes={["is-auth-page"]}>
      <Container className="text-center py-4">
        <Row className="mt-4">
          <Col
            sm={{ span: 10, offset: 1 }}
            md={{ span: 6, offset: 3 }}
            lg={{ span: 4, offset: 4 }}
          >
            <h4 className="mb-4 text-primary">
              <Logo color="dark" />
              <small className="d-block text-secondary text-upper text-spaced text-sm mt-2">
                {dictionary.AUTH_VERIFY_TITLE}
              </small>
            </h4>
            <Card>
              <Card.Body>
                {verify.pending ? (
                  <div className="py-5">
                    <Preloader
                      show={true}
                      color="primary"
                      text={dictionary.AUTH_VERIFY_PENDING_TEXT}
                    />
                  </div>
                ) : (
                  <React.Fragment>
                    {verify.isVerified ? (
                      <p className="py-5">
                        <span
                          dangerouslySetInnerHTML={sanitize(
                            dictionary.AUTH_VERIFY_SUCCESS
                          )}
                        />{" "}
                        <Link to={routes.LOGIN}>
                          <strong
                            dangerouslySetInnerHTML={sanitize(
                              dictionary.AUTH_VERIFY_SUCCESS_LINK
                            )}
                          />
                        </Link>{" "}
                      </p>
                    ) : null}
                    {verify.error ? (
                      <p className="py-5">{verify.error.message}</p>
                    ) : null}
                  </React.Fragment>
                )}
              </Card.Body>
            </Card>
            {!verify.pending ? (
              <div className="mt-3">
                <Link to={routes.LANDING} className="text-secondary">
                  <small>{dictionary.AUTH_BACK}</small>
                </Link>
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </Page>
  );
};

/**
 *  Map state to props
 */
const mapStateToProps = (state: any) => {
  const { isAuthenticated } = state.user;
  return { isAuthenticated };
};

export default connect(mapStateToProps, {})(Verify);
