import Empty from "antd/lib/empty";
import Button from "antd/lib/button";
import Card from "antd/lib/card/Card";
import Title from "antd/lib/typography/Title";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useMember from "../../api-facade/use-member";
import PageRoutes from "../../routing/page-routes";
import MemberInfoSkeleton from "../loading/member-info-skeleton";
import MemberDescription from "../member-info/member-description";
import MemberForm from "../member-info/member-form";
import AuthGuard from "../auth-guard/auth-guard";
import Authorizations from "../auth-guard/authorizations";

type Props = {
  id: number;
  editMode?: boolean;
};

const MemberProfile: FunctionComponent<Props> = ({ id, editMode }) => {
  const router = useRouter();
  const { member, loading } = useMember(id);

  if (loading) return <MemberInfoSkeleton />;
  if (!member) return <Empty />;

  let titleText = "";
  if (!member.first_name || !member.last_name) titleText = "Member " + member.id;
  else titleText = (member.first_name || "") + " " + (member.last_name || "");

  const editButton = (
    <AuthGuard auths={[Authorizations.admin, Authorizations.matchId]}>
      <Button
        size="large"
        type="primary"
        style={{ flexGrow: 1, maxWidth: "10rem" }}
        onClick={() => router.push(PageRoutes.editMember(id))}
      >
        Edit
      </Button>
    </AuthGuard>
  );

  const cancelButton = (
    <Button
      size="large"
      type="primary"
      danger
      style={{ flexGrow: 1, maxWidth: "10rem" }}
      onClick={() => router.push(PageRoutes.memberProfile(id))}
    >
      Cancel
    </Button>
  );

  const header = (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Title
        level={2}
        style={{
          margin: 0,
          minWidth: 0,
          marginRight: "auto",
          paddingRight: 16,
          whiteSpace: "break-spaces",
        }}
      >
        {titleText}
      </Title>
      {editMode ? cancelButton : editButton}
    </div>
  );

  if (editMode)
    return (
      <Card title={header}>
        <MemberForm
          member={member}
          onSuccess={() => {
            router.push(PageRoutes.memberProfile(id));
          }}
        />
      </Card>
    );

  return (
    <Card title={header} bodyStyle={{ padding: 0 }}>
      <MemberDescription member={member} />
    </Card>
  );
};

export default MemberProfile;