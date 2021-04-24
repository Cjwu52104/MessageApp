import React from 'react';
import {SafeAreaView, FlatList, Text, TextInput, Button } from 'react-native';

export default class ChatScreen extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      input: ''
    }
  }

  get user() {
    return {
      name: this.props.navigation.state.params.name
    }
  }

  get = () => {
    fetch('http://10.0.0.46:3000/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        messages: responseJson
      })
    });
  }

  handlePress = () => {
    var input = this.state.input

    fetch('http://10.0.0.46:3000/messages', {  
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          text: input
      })
    })
  }

  componentDidMount() {
    this._isMounted = true

    this.get
    setInterval(this.get, 2000);
  };

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const {messages} = this.state

    return(
      <SafeAreaView style={{padding: 24}}>
        <FlatList 
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({item}) => <Text>{item.text}</Text>}/>

        <Button title="Send Message" style={{margin: 10}} onPress={this.handlePress}/>

        <TextInput style={{borderWidth:1}}
        onChangeText={input => this.setState({input})}
        placeholder="Enter a Message"/>

      </SafeAreaView>
    )
  }
};
