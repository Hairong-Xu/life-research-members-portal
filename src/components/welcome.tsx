import { Row, Col, Typography, Divider, Space } from "antd";
import {
  TeamOutlined,
  AppstoreOutlined,
  FundOutlined,
  CalendarOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { AllMembersCtx } from "../services/context/all-members-ctx";
import { AllGrantsCtx } from "../services/context/all-grants-ctx";
import { AllEventsCtx } from "../services/context/all-events-ctx";
import { AllSupervisionsCtx } from "../services/context/all-supervisions-ctx";
import { AllProductsCtx } from "../services/context/all-products-ctx";
import { AllPartnersCtx } from "../services/context/all-partners-ctx";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import Spin from "antd/lib/spin";
import { FC, useContext } from "react";
import { ActiveAccountCtx } from "../services/context/active-account-ctx";
import { blue, green } from "@ant-design/colors";
import { LanguageCtx } from "../services/context/language-ctx";
import Image from "next/image";
import life from "../../public/life-home2.png";
import PageRoutes from "../routing/page-routes";
import Link from "next/link";

const { Title } = Typography;

const Welcome: FC = () => {
  const { localAccount, loading } = useContext(ActiveAccountCtx);
  const { en } = useContext(LanguageCtx);

  const { allMembers } = useContext(AllMembersCtx);
  const activeMembersCount = allMembers.length;

  const { allGrants } = useContext(AllGrantsCtx);
  const activeGrantsCount = allGrants.length;

  const { allEvents } = useContext(AllEventsCtx);
  const activeEventsCount = allEvents.length;

  const { allSupervisions } = useContext(AllSupervisionsCtx);
  const activeSupervisionsCount = allSupervisions.length;

  const { allProducts } = useContext(AllProductsCtx);
  const activeProductsCount = allProducts.length;

  const { allPartners } = useContext(AllPartnersCtx);
  const activePartnersCount = allPartners.length;

  const adminGreeting = (
    <h4 style={{ color: green[6] }}>
      {en
        ? "You are login in as an administrator"
        : "Vous êtes connecté en tant qu'administrateur"}
    </h4>
  );

  const noMemberInfo = (
    <>
      <h4>
        {en
          ? "please uptade your profile!"
          : "veuillez mettre à jour votre profil!"}
      </h4>
    </>
  );

  const memberGreeting = (
    <>
      <h4>
        {en
          ? "You are login in as an member"
          : "Vous êtes connecté en tant que membre"}
      </h4>
    </>
  );
  const notRegistered = (
    <>
      <h4>
        {en
          ? "This account is not registered."
          : "Ce compte n'est pas enregistré."}
      </h4>
    </>
  );

  const unauthenticatedGreeting = (
    <>
      <h1>
        {en
          ? "Welcome to the LIFE Research Insitute Member Portal!"
          : "Bienvenue sur le portail des membres de l'Institut de recherche LIFE!"}
      </h1>
      <h4>
        {en
          ? "If you are a member, please login to access your profile and other features."
          : "Si vous êtes membre, veuillez vous connecter pour accéder à votre profil et d'autres fonctionnalités."}
      </h4>
    </>
  );

  const greeting = () => {
    if (loading) return <Spin size="large" />;
    if (!localAccount) return notRegistered;
    return (
      <>
        <h3>
          {en
            ? `Good morning, ${localAccount.first_name}!`
            : `Bonjour ${localAccount.first_name} !`}
        </h3>
        <h1>
          {en
            ? "Welcome to the LIFE Research Insitute Member Portal"
            : "Bienvenue sur le portail des membres de l'Institut de recherche LIFE"}
        </h1>

        {localAccount.is_admin
          ? adminGreeting
          : localAccount.member
          ? memberGreeting
          : noMemberInfo}
      </>
    );
  };

  return (
    <div className="homepage">
      <div className="banner" style={{ backgroundColor: "#f8f8f8" }}>
        <div className="banner-content">
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              md={12}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <UnauthenticatedTemplate>
                {unauthenticatedGreeting}
              </UnauthenticatedTemplate>
              <AuthenticatedTemplate>{greeting()}</AuthenticatedTemplate>
            </Col>
            <Col
              className="welcome-image"
              xs={24}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={life}
                alt="LIFE Research Institute Home"
                width={530} // Set the width and height to the desired values
                height={340}
              />
            </Col>
          </Row>
        </div>
      </div>
      <div className="center-title">
        <Title level={2}>
          {en
            ? "Live well. Live long. Live with voice and choice."
            : "Bien vivre. Vivre longtemps. Vivre avec des choix et une voix."}
        </Title>
      </div>

      <div className="four-columns-container">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Title level={4}>
              {en ? "LIFE at a glance" : "LIFE en un coup d'œil"}
            </Title>
            <p>
              {en
                ? "A short description about life at the institute, highlighting key aspects and experiences."
                : "Une brève description de l'institut, mettant en lumière les aspects clés et les expériences."}
            </p>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Link href={PageRoutes.allMembers}>
                <a>
                  <div className="rounded-box rounded-box-gradient-1">
                    <TeamOutlined className="icon-gradient" />
                    <span className="count">{activeMembersCount}</span>
                    <span className="title">
                      {en ? "Active Members" : "Membres actifs"}
                    </span>
                  </div>
                </a>
              </Link>
              <Link href={PageRoutes.allProducts}>
                <a>
                  <div className="rounded-box rounded-box-gradient-2">
                    <AppstoreOutlined className="icon-gradient" />
                    <span className="count">{activeProductsCount}</span>
                    <span className="title">
                      {en ? "Products" : "Produits"}
                    </span>
                  </div>
                </a>
              </Link>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Link href={PageRoutes.allGrants}>
                <a>
                  <div className="rounded-box rounded-box-gradient-3">
                    <FundOutlined className="icon-gradient" />
                    <span className="count">{activeGrantsCount}</span>

                    <span className="title">
                      {en ? "Grants" : "Subventions"}
                    </span>
                  </div>
                </a>
              </Link>
              <Link href={PageRoutes.allEvents}>
                <a>
                  <div className="rounded-box rounded-box-gradient-4">
                    <CalendarOutlined className="icon-gradient" />
                    <span className="count">{activeEventsCount}</span>

                    <span className="title">
                      {en ? "Events" : "Événements"}
                    </span>
                  </div>
                </a>
              </Link>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical">
              <Link href={PageRoutes.allSupervisions}>
                <a>
                  <div className="rounded-box rounded-box-gradient-5">
                    <SolutionOutlined className="icon-gradient" />
                    <span className="count">{activeSupervisionsCount}</span>

                    <span className="title">
                      {en ? "Supervisions" : "Supervisions"}
                    </span>
                  </div>
                </a>
              </Link>
              <Link href={PageRoutes.allPartners}>
                <a>
                  <div className="rounded-box rounded-box-gradient-6">
                    <TeamOutlined className="icon-gradient" />
                    <span className="count">{activePartnersCount}</span>

                    <span className="title">
                      {en ? "Partners" : "Partenaires"}
                    </span>
                  </div>
                </a>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Welcome;