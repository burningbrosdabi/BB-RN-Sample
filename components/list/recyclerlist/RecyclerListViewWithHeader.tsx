import { UpIcon } from 'assets/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RecyclerListView } from 'recyclerlistview';
// import { ScrollView } from 'react-native';
import { Colors, Outlines, Spacing } from '_styles';



// Create header component with gap

// Use forwardRef to wrap a ScrollView that has the Header before the rest of the
// Children are rendered.  forwardRef is there because RecyclerListView expects whatever you
// pass it as the externalScrollView to have the same methods available as ScrollView
const ScrollViewWithHeader = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <ScrollView ref={ref} {...props}>
      {props.renderHeader ? props.renderHeader() : null}
      {children}
    </ScrollView>
  );
});

// Overriding PropType because it doesn't expect a forwardRef response even though that
// works without issue
RecyclerListView.propTypes.externalScrollView = PropTypes.object;

// Use the headered scroll view to underly the RecyclerList
// Using Forwarding Refs
// https://ko.reactjs.org/docs/forwarding-refs.html

const _renderFooter = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 90,
      }}>
      <ActivityIndicator />
    </View>
  );
};
// 152 & 151.5
const RecyclerListViewWithHeader = (props) => {
  const recyclerRef = React.createRef();
  const { container } = styles;
  const { upIcon = true } = props
  return (
    <View style={container}>
      <View style={container}>
        <RecyclerListView
          ref={recyclerRef}
          externalScrollView={ScrollViewWithHeader}
          renderAheadOffset={Spacing.screen.height}
          renderFooter={_renderFooter}
          showsVerticalScrollIndicator={false}
          {...props}
        />
      </View>

      {upIcon && <View
        style={{
          zIndex: 1000,
          position: 'absolute',
          bottom: 20,
          right: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            const ref = recyclerRef.current;
            ref.scrollToTop();
          }}
          style={{ alignItems: 'center' }}>
          <View style={[styles.buttonContainer]}>
            <UpIcon />
          </View>
        </TouchableOpacity>
        {props.recentItem && props.recentItem()}
      </View>}
    </View>
  );
};

export default RecyclerListViewWithHeader;
const styles = StyleSheet.create({
  container: { flex: 1, zIndex: 0, minHeight: 1, minWidth: 1 },
  buttonContainer: {
    padding: 8,
    zIndex: 500,
    backgroundColor: Colors.white,
    borderWidth: Outlines.borderWidth.base,
    borderColor: Colors.line,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    borderRadius: 50,
  },
});
