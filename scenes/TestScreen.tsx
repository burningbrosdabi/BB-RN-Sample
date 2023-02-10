import ViewTextMore from 'components/text/ViewTextMore';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActions } from 'utils/hooks/useActions';
// Redux
import { useTypedSelector } from 'utils/hooks/useTypedSelector';




const TestScreen = () => {
  const { token, isLoggedIn } = useTypedSelector((state) => state.auth);
  const { setLoading } = useActions();

  //   ComponentDidMount
  useEffect(() => {
    setLoading(true);
    setInterval(() => {
      setLoading(false);
    }, 100);
  }, []);


  const text_line_break_1 = "\n1234567890123456789012345678901234567890\n1234567890123456789012345678901234567890123456789012345678901234567890"
  const text_line_break_2 = "\n\nabc\n\nStart with Line breaklNormalNormalNormalNormalNormalNormalNormal"
  const text_line_break_3 = "Normal long letter case \n sagittis taciti sodales dignissim lacinia vitae, gravida morbi congue et senectus eleifend est mollis, vel tristique dis ridiculus inceptos libero nec.dd"
  const text_line_break_4 = "\n\n\n12dlmslkdmslkdmlskmdlksmdlksmdlksmdlksmdlksmlk345670\n\n\n\n\n\n\n\n\n\n\n\na"
  const num_line = 2
  return (
    <>
      <SafeAreaView style={styles.safe}>
        <View style={styles.root}>

          <View style={{ backgroundColor: 'khaki', marginBottom: 25 }}>
            <ViewTextMore numberOfLines={num_line}>{'Short for expanding'}</ViewTextMore>
          </View>


          <View style={{ backgroundColor: 'pink', marginBottom: 25 }}>
            <ViewTextMore numberOfLines={num_line}>{text_line_break_1}</ViewTextMore>
          </View>

          <View style={{ backgroundColor: 'skyblue', marginBottom: 25, marginHorizontal: 50 }}>
            <ViewTextMore numberOfLines={num_line}>{text_line_break_2}</ViewTextMore>
          </View>

          <View style={{ backgroundColor: 'ivory', marginBottom: 25 }}>
            <ViewTextMore numberOfLines={num_line}>{text_line_break_3}</ViewTextMore>
          </View>
          <View style={{ backgroundColor: 'skyblue', marginBottom: 25 }}>
            <ViewTextMore numberOfLines={num_line}>{text_line_break_4}</ViewTextMore>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  root: {
    flex: 1,
    padding: 16,
  },
  textStyle: {
    fontSize: 14,
  },
});

export default TestScreen;
