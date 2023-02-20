import Button from "antd/lib/button";
import Table, { ColumnType } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LanguageCtx } from "../../services/context/language-ctx";
import type { PartnerPublicInfo } from "../../services/_types";
import PageRoutes from "../../routing/page-routes";
import { AllPartnersCtx } from "../../services/context/all-partners-ctx";
import GetLanguage from "../../utils/front-end/get-language";
import Descriptions from "antd/lib/descriptions";
import Item from "antd/lib/descriptions/Item";
import SafeLink from "../link/safe-link";

import Router, { useRouter } from "next/router";
import Form from "antd/lib/form";
import blurActiveElement from "../../utils/front-end/blur-active-element";
import { Checkbox } from "antd";
import OrgTypeFilter from "../filters/org-type-filter";
import OrgScopeFilter from "../filters/org-scope-filter";
import OrgNameFilter from "../filters/org-name-filter";
import PartnerNameFilter from "../filters/partner-name-filter";
import type { ParsedUrlQueryInput } from "querystring";
import { ActiveAccountCtx } from "../../services/context/active-account-ctx";

function nameSorter(a: { name_en: string }, b: { name_en: string }) {
  return a.name_en.localeCompare(b.name_en);
}
function getName(organization: PartnerPublicInfo) {
  return organization.name_en || "";
}

function filterFn(
  m: PartnerPublicInfo & { name: string },
  filters: {
    nameFilter: Set<number>;
    typeFilter: Set<number>;
    scopeFilter: Set<number>;
  }
): boolean {
  const { nameFilter, typeFilter, scopeFilter } = filters;
  if (nameFilter.size > 0 && !nameFilter.has(m.id)) return false;

  if (typeFilter.size > 0) {
    if (!m.org_type && !typeFilter.has(0)) return false; // id 0 is for null
    if (m.org_type && !typeFilter.has(m.org_type.id)) return false;
  }
  if (scopeFilter.size > 0) {
    if (!m.org_scope && !scopeFilter.has(0)) return false; // id 0 is for null
    if (m.org_scope && !scopeFilter.has(m.org_scope.id)) return false;
  }

  return true;
}

// Use query params for filters - for bookmarking, back button etc.
export const queryKeys = {
  showType: "showType",
  showScope: "showScope",
  type: "type",
  scope: "scope",
  orgIds: "orgIds",
} as const;

// Don't want to change url if query is default value
const defaultQueries = {
  showType: true,
  showScope: true,
} as const;

function handleNameFilterChange(next: Set<number>) {
  Router.push(
    {
      query: {
        ...Router.query,
        [queryKeys.orgIds]: Array.from(next.keys()),
      },
    },
    undefined,
    { scroll: false }
  );
}

function handleTypeFilterChange(next: Set<number>) {
  Router.push(
    {
      query: {
        ...Router.query,
        [queryKeys.type]: Array.from(next.keys()),
      },
    },
    undefined,
    { scroll: false }
  );
}

function handleScopeFilterChange(next: Set<number>) {
  Router.push(
    {
      query: {
        ...Router.query,
        [queryKeys.scope]: Array.from(next.keys()),
      },
    },
    undefined,
    { scroll: false }
  );
}

function handleShowScopeChange(value: boolean) {
  const query: ParsedUrlQueryInput = {
    ...Router.query,
    [queryKeys.showScope]: value,
  };
  if (value === defaultQueries.showScope) delete query[queryKeys.showScope];
  Router.push({ query }, undefined, { scroll: false });
}

function handleShowTypeChange(value: boolean) {
  const query: ParsedUrlQueryInput = {
    ...Router.query,
    [queryKeys.showType]: value,
  };
  if (value === defaultQueries.showType) delete query[queryKeys.showType];
  Router.push({ query }, undefined, { scroll: false });
}

function clearQueries() {
  Router.push({ query: null }, undefined, { scroll: false });
}

function getIdsFromQueryParams(key: string): Set<number> {
  const res = new Set<number>();
  const query = Router.query[key];
  if (!query) return res;
  if (typeof query === "string") {
    const id = parseInt(query);
    if (!isNaN(id)) res.add(id);
  } else {
    for (const keyword of query) {
      const id = parseInt(keyword);
      if (!isNaN(id)) res.add(id);
    }
  }
  return res;
}

function getPopupContainer(): HTMLElement {
  return (
    document.querySelector(".all-organizations-table .filters") || document.body
  );
}

const AllPartners: FC = () => {
  const { en } = useContext(LanguageCtx);

  const {
    allPartners,
    loading,
    refresh: refreshOrganizations,
  } = useContext(AllPartnersCtx);

  const { localAccount } = useContext(ActiveAccountCtx);

  const handleRegisterPartner = () => {
    router.push("partners/register");
  };

  useEffect(() => {
    refreshOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showType, setShowType] = useState<boolean>(defaultQueries.showType);
  const [showScope, setShowScope] = useState<boolean>(defaultQueries.showScope);

  const [nameFilter, setNameFilter] = useState(new Set<number>());
  const [typeFilter, setTypeFilter] = useState(new Set<number>());
  const [scopeFilter, setScopeFilter] = useState(new Set<number>());

  const router = useRouter();
  const showTypeQuery = router.query[queryKeys.showType];
  const showScopeQuery = router.query[queryKeys.showScope];
  const typeQuery = router.query[queryKeys.type];
  const scopeQuery = router.query[queryKeys.scope];
  const nameIdsQuery = router.query[queryKeys.orgIds];

  useEffect(() => {
    if (!showTypeQuery) setShowType(defaultQueries.showType);
    if (showTypeQuery === "true") setShowType(true);
    if (showTypeQuery === "false") setShowType(false);
  }, [showTypeQuery]);

  useEffect(() => {
    if (!showScopeQuery) setShowScope(defaultQueries.showScope);
    if (showScopeQuery === "true") setShowScope(true);
    if (showScopeQuery === "false") setShowScope(false);
  }, [showScopeQuery]);

  useEffect(() => {
    setNameFilter(getIdsFromQueryParams(queryKeys.orgIds));
  }, [nameIdsQuery]);

  useEffect(() => {
    setTypeFilter(getIdsFromQueryParams(queryKeys.type));
  }, [typeQuery]);

  useEffect(() => {
    setScopeFilter(getIdsFromQueryParams(queryKeys.scope));
  }, [scopeQuery]);

  function refreshAndClearFilters() {
    clearQueries();
    refreshOrganizations();
  }

  const filteredOrganisation = useMemo(
    () =>
      allPartners
        .map((m) => ({ ...m, key: m.id, name: getName(m) }))
        .filter((m) =>
          filterFn(m, {
            nameFilter,
            typeFilter,
            scopeFilter,
          })
        ),
    [allPartners, typeFilter, scopeFilter, nameFilter]
  );

  type OrganizationColumnType = ColumnType<typeof filteredOrganisation[number]>;

  const nameColumn: OrganizationColumnType = useMemo(
    () => ({
      title: en ? "Name" : "Nom",
      dataIndex: "name",
      className: "name-column",
      sorter: nameSorter,
      render: (value, organization) => (
        <SafeLink href={PageRoutes.organizationProfile(organization.id)}>
          {value}
        </SafeLink>
      ),
    }),
    [en]
  );

  const typeColumn: OrganizationColumnType = useMemo(
    () => ({
      title: en ? "Organization Type" : "Type d'organisation",
      dataIndex: ["type", en ? "name_en" : "name_fr"],
      className: "type-column",
      sorter: en
        ? (a, b) =>
            (a.org_type?.name_en || "").localeCompare(b.org_type?.name_en || "")
        : (a, b) =>
            (a.org_type?.name_fr || "").localeCompare(
              b.org_type?.name_fr || ""
            ),
    }),
    [en]
  );

  const scopeColumn: OrganizationColumnType = useMemo(
    () => ({
      title: en ? "Organization Scope" : "Champ d'activité",
      dataIndex: ["scope", en ? "name_en" : "name_fr"],
      className: "scope-column",
      sorter: en
        ? (a, b) =>
            (a.org_scope?.name_en || "").localeCompare(
              b.org_scope?.name_en || ""
            )
        : (a, b) =>
            (a.org_scope?.name_fr || "").localeCompare(
              b.org_scope?.name_fr || ""
            ),
    }),
    [en]
  );

  const columns: OrganizationColumnType[] = [nameColumn];
  if (showType) columns.push(typeColumn);
  if (showScope) columns.push(scopeColumn);

  const filters = (
    <Form
      onFinish={blurActiveElement}
      className="filters"
      labelAlign="left"
      size="small"
    >
      <Form.Item
        label={en ? "Filter by name" : "Filtrer par nom"}
        htmlFor="name-filter"
      >
        <OrgNameFilter
          id="name-filter"
          value={nameFilter}
          onChange={handleNameFilterChange}
          getPopupContainer={getPopupContainer}
        />
      </Form.Item>
      <Form.Item
        label={en ? "Filter by type" : "Filtrer par type"}
        htmlFor="type-filter"
      >
        <OrgTypeFilter
          id="type-filter"
          value={typeFilter}
          onChange={handleTypeFilterChange}
          getPopupContainer={getPopupContainer}
        />
      </Form.Item>

      <Form.Item
        label={en ? "Filter by scope" : "Filtrer par champ d'activité"}
        htmlFor="scope-filter"
      >
        <OrgScopeFilter
          id="scope-filter"
          value={scopeFilter}
          onChange={handleScopeFilterChange}
          getPopupContainer={getPopupContainer}
        />
      </Form.Item>
      <label htmlFor="show-column-checkboxes">
        {en ? "Show Columns:" : "Afficher les colonnes:"}
      </label>

      <span className="show-column-checkboxes" id="show-column-checkboxes">
        <Checkbox
          checked={showType}
          onChange={(e) => handleShowTypeChange(e.target.checked)}
        >
          {en ? "Show Organization Type" : "Afficher le type"}
        </Checkbox>

        <Checkbox
          checked={showScope}
          onChange={(e) => handleShowScopeChange(e.target.checked)}
        >
          {en ? "Show Organization Scope" : "Afficher le champ d'activité"}
        </Checkbox>
      </span>
    </Form>
  );

  const Header = () => (
    <>
      <div className="header-title-row">
        <Title level={1}>{en ? "All Partners" : "Tous les partenaires"}</Title>
        <Button type="primary" onClick={refreshAndClearFilters} size="large">
          {en ? "Reset the filter" : "Réinitialiser le filtre"}
        </Button>{" "}
        {localAccount && localAccount.is_admin && (
          <Button
            type="primary"
            size="large"
            onClick={() => handleRegisterPartner()}
          >
            {en ? "Add a new partner" : "Ajouter un nouveau partenaire"}
          </Button>
        )}
      </div>
      {filters}
    </>
  );

  const expandedRowRender = (organization: PartnerPublicInfo) => (
    <Descriptions size="small" layout="vertical" className="problems-container">
      <Item label={en ? "About" : "À propos"}>{organization.description}</Item>
    </Descriptions>
  );

  return (
    <Table
      className="all-partners-table"
      size="small"
      tableLayout="auto"
      columns={columns}
      dataSource={filteredOrganisation}
      loading={loading}
      title={Header}
      pagination={false}
      showSorterTooltip={false}
      sticky={{ offsetHeader: 74 }}
      scroll={{ x: true }}
      rowClassName={(_, index) =>
        "table-row " + (index % 2 === 0 ? "even" : "odd")
      }
      expandable={{
        expandedRowRender,
        expandedRowClassName: (_, index) =>
          "expanded-table-row " + (index % 2 === 0 ? "even" : "odd"),
        rowExpandable: (m) => !!m.description && m.description.length > 0,
      }}
    />
  );
};

export default AllPartners;