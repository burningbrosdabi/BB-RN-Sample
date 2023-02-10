import { ConnectionDetection } from 'components/empty/OfflineView';
import UserFeedbackList from 'components/list/feedbacks/UserFeedbackList';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { getUserFeedbacksApi } from 'services/api';
import { Colors } from 'styles';
import { Header } from "components/header/Header";

const UserFeedbackListScreen = ({ route }: { route: { params: any } }) => {
  const feedbackListRef = useRef(null);

  const _fetchData = async (props?: any) => {
    const data = await getUserFeedbacksApi({ ...props });
    return data;
  };

  return (
    <ConnectionDetection.View>
      <>
        <SafeAreaView>
          <Header title={'Đánh giá của tôi'} />
        </SafeAreaView>
        <View style={styles.container}>
          <UserFeedbackList ref={feedbackListRef} fetchData={_fetchData} />
        </View>
      </>
    </ConnectionDetection.View>
  );
};

export default UserFeedbackListScreen;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: Colors.background,
    flex: 1,
  },
});
