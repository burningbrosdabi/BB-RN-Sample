import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SearchContext } from 'scenes/search/context';
import { Subject } from 'rxjs';
import { debounceTime, skipWhile } from 'rxjs/operators';
import { SearchResultRouteSetting } from 'routes/search/search.route';
import { saveSearchKeyword } from 'services/api/search/search.api';
import { useNavigator } from 'services/navigation/navigation.service';
import { useAsync } from 'utils/hooks/useAsync';
import { loadCategory } from 'utils/state/action-creators/product.action-creators';
import ProductSubcategory from '../../model/product/product.subcategory';
import { concat, isNil } from 'lodash';
import { ProductCategoryFilterRouteSetting } from 'routes/product/productCategoryFilter.route';
import { Keyword } from 'model/search/keyword';

export const useFetchOnKeystroke = <T extends object>({
  fetch,
}: {
  fetch: (query: string) => Promise<T[]>;
}) => {
  const { textStream: stream } = useContext(SearchContext);
  const dataStream = useRef(new Subject<T[]>()).current;
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const sub = stream
      .pipe(
        debounceTime(500),
        skipWhile(value => value.length < 2),
      )
      .subscribe(query => {
        fetch(query).then(value => dataStream.next(value));
      });

    const dataSub = dataStream.pipe(debounceTime(200)).subscribe(products => {
      setData(products);
    });

    return () => {
      sub.unsubscribe();
      dataSub.unsubscribe();
    };
  }, []);

  return { data };
};

export const useSelectKeyword = () => {
  const { textStream, subCateNameMap, catgMap } = useContext(SearchContext);
  const navigator = useNavigator();

  return (keyword: string) => {
    const subcatg = subCateNameMap[keyword];
    const catg = catgMap[subcatg];

    navigator.navigate(
      new SearchResultRouteSetting({
        query: keyword,
        category: catg,
        subCategory: subcatg,
      }),
    );
    // wait for transition into another screen
    setTimeout(() => {
      textStream.next(keyword);
    }, 300);
    saveSearchKeyword({
      keyword,
      pk: new Date().getTime(),
    });
  };
};

export const useFetchCategory = () => {
  const data = useMemo(() => {
    return loadCategory();
  }, []);
  const catgMap = useRef<{ [id: string]: string }>({});
  const subCateNameMap = useRef<{ [id: string]: string }>({});
  const [subcatg, setSubcatg] = useState<ProductSubcategory[]>([]);

  useEffect(() => {
    if (!data) return;
    // @ts-ignore
    const subcatg = data!.reduce((prev, catg) => {
      const productsubcategory_set = catg.productsubcategory_set.filter(value => {
        if (value.name !== 'all') {
          catgMap.current[value.name] = catg.name;
          subCateNameMap.current[value.display_name.trim()] = value.name.trim();
        }
        return value.name !== 'all';
      });

      return concat(prev, productsubcategory_set);
    }, []) as ProductSubcategory[];
    setSubcatg(subcatg);
  }, [data]);

  return { subcatg, catgMap: catgMap.current, subCateNameMap: subCateNameMap.current };
};
