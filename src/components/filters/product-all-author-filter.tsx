import Select, { SelectProps } from "antd/lib/select";
import { FC, useContext, useMemo } from "react";
import { LanguageCtx } from "../../services/context/language-ctx";
import { AllProductsCtx } from "../../services/context/all-products-ctx";
import type { ProductPublicInfo } from "../../services/_types";
import fuzzyIncludes from "../../utils/front-end/fuzzy-includes";

function getAllAuthor(product: ProductPublicInfo) {
  return product.all_author;
}

type Props = {
  id?: string;
  value?: Set<string>;
  onChange?: (value: Set<string>) => void;
  getPopupContainer?: SelectProps["getPopupContainer"];
};

const ProductAllAuthorFilter: FC<Props> = ({
  id,
  value = new Set<string>(),
  onChange = () => {},
  getPopupContainer,
}) => {
  const { allProducts } = useContext(AllProductsCtx);
  const { en } = useContext(LanguageCtx);

  const valueArray = useMemo(() => Array.from(value.values()), [value]);

  const options = useMemo(
    () =>
      Array.from(
        new Set(
          allProducts
            .map((m) => getAllAuthor(m))
            .flatMap((authors) =>
              authors!
                .split(/(?:,|;|&)(?!\s\w\.)/)
                .map((author) => author.trim())
            )
        )
      ).map((author) => ({ label: author, value: author })),
    [allProducts]
  );

  function onSelect(id: string) {
    value.add(id);
    onChange(value);
  }

  function onDelete(id: string) {
    value.delete(id);
    onChange(value);
  }

  function filterOption(
    input: string,
    option?: typeof options[number]
  ): boolean {
    if (!option) return false;
    return fuzzyIncludes(option.label, input);
  }

  return (
    <Select
      id={id}
      className="product-all-author-filter"
      value={valueArray}
      filterOption={filterOption}
      mode="multiple"
      options={options}
      allowClear
      onSelect={onSelect}
      onDeselect={onDelete}
      getPopupContainer={getPopupContainer}
    ></Select>
  );
};

export default ProductAllAuthorFilter;
