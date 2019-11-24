import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/UserListScreenStyle'
import { UserItem } from '../Components/UserItem'
import { getUserList, generateUUID, createOrgetChannel, CHANNEL_TYPE } from '../Services/ChatEngine'
import { Colors } from '../Themes'
import { ItemSeparator } from '../Components/ItemSeparator'

class UserListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: []
    }
    this.onPressUser = this.onPressUser.bind(this)
  }

  componentDidMount() {
    getUserList(userList => this.setState({ userList }))
  }

  onPressUser(user) {
    createOrgetChannel(user, CHANNEL_TYPE.single, undefined, (channel) => console.log(channel))
  }

  render() {
    const { userList } = this.state
    return (
      <FlatList
        data={userList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <UserItem data={item} onPress={() => this.onPressUser(item)} />}
        ItemSeparatorComponent={() => <ItemSeparator />}
        contentContainerStyle={{ padding: 10 }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListScreen)