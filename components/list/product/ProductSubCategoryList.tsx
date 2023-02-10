import { Button, ButtonState, ButtonType } from 'components/button/Button';
import { ProductSubcategory } from 'model';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from 'styles';

/** @deprecated   **/
const ProductSubCategoryList = ({
    data = [],
    selectedSubCategory,
    handleOnPress,
}: {
    data: ProductSubcategory[];
    selectedSubCategory: ProductSubcategory;
    handleOnPress: (item: ProductSubcategory) => void;
}) => {
    const [subCategory, setSubCategory] = useState([]);
    return (
        subCategory && (
            <View
                style={{
                    marginHorizontal: 12,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                }}>
                {data.map((item: ProductSubcategory, index: number) => {
                    const selected = selectedSubCategory == item
                    return (
                        <View
                            key={index}
                            style={{
                                width: (Spacing.screen.width - 12 * 3) / 2,
                                marginBottom: 12,
                            }}>
                            <Button
                                text={item.display_name}
                                type={ButtonType.option}
                                state={selected ? ButtonState.focused : ButtonState.idle}
                                alignItems="flex-start"
                                onPress={() => handleOnPress(item)}
                                textStyle={{ textTransform: 'none' }}
                            />
                        </View>
                    );
                })}
            </View>
        )
    );
};

const styles = StyleSheet.create({
    btnTextStyle: { textTransform: 'none', color: Colors.text },
});

export default ProductSubCategoryList;
