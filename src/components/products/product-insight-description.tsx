import Grid from "antd/lib/grid";
import Descriptions from "antd/lib/descriptions";
import Item from "antd/lib/descriptions/Item";
import { FC, useContext } from "react";
import type { ProductPrivateInfo } from "../../services/_types";
import React from "react";
import { LanguageCtx } from "../../services/context/language-ctx";
import { Tag } from "antd";

const { useBreakpoint } = Grid;

type Props = {
  product: ProductPrivateInfo;
};

const ProductInsightDescription: FC<Props> = ({ product }) => {
  const screens = useBreakpoint();
  const { en } = useContext(LanguageCtx);

  return (
    <Descriptions
      size="small"
      bordered
      column={1}
      labelStyle={{ whiteSpace: "break-spaces", width: "8rem" }}
      contentStyle={{ whiteSpace: "break-spaces" }}
      layout={screens.xs ? "vertical" : "horizontal"}
    >
      <Item label={en ? "Peer reviewed" : "Évalué par les pairs"}>
        {product.peer_reviewed ? (en ? "Yes" : "Oui") : en ? "No" : "Non"}
      </Item>

      <Item label={en ? "On going " : "En cours"}>
        {product.on_going ? (en ? "Yes" : "Oui") : en ? "No" : "Non"}
      </Item>

      <Item label={en ? "Product Topic" : "Sujet du produit"}>
        {product.product_topic.map((entry, i) => (
          <Tag key={i} color="blue">
            {en ? entry.topic.name_en : entry.topic.name_fr}
          </Tag>
        ))}
      </Item>
    </Descriptions>
  );
};

export default ProductInsightDescription;