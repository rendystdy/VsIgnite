import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Styled, CustomFlatList, Method } from 'react-native-awesome-component'
import { Text, KeyboardAvoidingView } from 'react-native'
import ChatInput from '../../Components/ChatInput'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PubnubActions from '../../Redux/PubnubRedux'
import PubnubStrings from '../../Pubnub/PubnubStrings'
import { values } from 'ramda'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.chatData = props.navigation.getParam('data')
    this.onPressSendMessage = this.onPressSendMessage.bind(this)
    this.onStartTyping = this.onStartTyping.bind(this)
    this.onEndTyping = this.onEndTyping.bind(this)
    this.fetchFunction = this.fetchFunction.bind(this)
  }

  componentDidMount() {
    this.fetchFunction()
  }

  fetchFunction() {
    const { getMessageRequest } = this.props
    getMessageRequest({ limit: 100, channels: [this.chatData.id] })
  }

  onPressSendMessage(message) {
    const { sendPubnubMessage } = this.props
    const params = {
      message: {
        type: PubnubStrings.message.type.text,
        text: message
      },
      channel: this.chatData.id,
    }
    sendPubnubMessage(params)
  }

  onStartTyping() {
    const { sendPubnubTyping } = this.props
    console.tron.error('START TYPING')
    sendPubnubTyping({ channel: this.chatData.id, isTyping: true })
  }

  onEndTyping() {
    const { sendPubnubTyping } = this.props
    console.tron.error('END TYPING')
    sendPubnubTyping({ channel: this.chatData.id, isTyping: false })

  }

  render() {
    let keyboardAvoidingViewProps = {}
    if (Platform.OS === 'ios') {
      keyboardAvoidingViewProps = { behavior: 'padding', keyboardVerticalOffset: 64 }
    }

    return (
      <Styled.FlexContainer>
        <CustomFlatList
          data={[]}
          fetchFunction={() => null}
          meta={{ current_page: 1, next_page: null }}
          renderItem={({ item }) => console.tron.error({ item })}
          loading={false}
          error={false}
        />
        <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
          <ChatInput onSendMessage={this.onPressSendMessage} onStartTyping={this.onStartTyping} onEndTyping={this.onEndTyping} />
        </KeyboardAvoidingView>
      </Styled.FlexContainer>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { navigation } = props
  const data = navigation.getParam('data')
  let messages = []
  if (state.pubnubStore.spaces[data.id] && state.pubnubStore.spaces[data.id].messages) {
    messages = values(state.pubnubStore.spaces[data.id].messages).sort(Method.Array.compareValues('timetoken', 'desc', true, true))
  }
  return {
    messages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPubnubMessage: (params) => dispatch(PubnubActions.getPubnubMessageRequest(params)),
    sendPubnubMessage: (params) => dispatch(PubnubActions.sendPubnubMessageRequest(params)),
    sendPubnubTyping: (params) => dispatch(PubnubActions.sendPubnubTypingRequest(params)),
    getMessageRequest: (params) => dispatch(PubnubActions.getPubnubMessageRequest(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
