import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import ProgressBar from './ProgressBar';


class Messages extends Component {
	state = {
		privateChannel: this.props.isPrivateChannel,
		privateMessagesRef: firebase.database().ref('privateMessages'),
		messagesRef: firebase.database().ref('messages'),
		messages: [],
		messagesLoading: true,
		channel: this.props.currentChannel,
		user: this.props.currentUser,
		progressBar: false,
		numUniqueUsers: '',
		searchTerm: '',
		searchLoading: false,
		searchResult: []
	};

	componentDidMount() {
		const { channel, user } = this.state;

		if (channel && user) {
			this.addListeners(channel.id);
		}
	};

	addListeners = channelId => {
		this.addMessageListener(channelId);
	};

	addMessageListener = channelId => {
		let loadedMessages = [];
		const ref = this.getMessagesRef();
		ref.child(channelId).on('child_added', snap => {
			loadedMessages.push(snap.val());
			this.setState({
				messages: loadedMessages,
				messagesLoading: false
			})
		});
		this.countUniqueUsers(loadedMessages);
	};

	getMessagesRef = () => {
		const { messagesRef, privateMessagesRef, privateChannel } = this.state;
		return privateChannel ? privateMessagesRef : messagesRef;
	};

	handleSearchMessages = () => {
		const channelMessages = [...this.state.messages];
		const regex = new RegExp(this.state.searchTerm, 'gi');
		const searchResult = channelMessages.reduce((acc, message) => {
			if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
				acc.push(message);
			}
			return acc;
		}, []);
		this.setState({searchResult});
		setTimeout(() => this.setState({searchLoading: false}), 1000);
	};

	handleSearchChanged = event => {
		this.setState({
			searchTerm: event.target.value,
			searchLoading: true
		}, () => this.handleSearchMessages());
	};

	countUniqueUsers = messages => {
		const uniqueUsers = messages.reduce((acc, message) => {
			if (!acc.includes(message.user.name)) {
				acc.push(message.user.name)
			}
			return acc;
		}, []);
		const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
		const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
		this.setState({numUniqueUsers})
	};

	displayMessages = messages => (
		messages.length > 0 && messages.map(message => (
			<Message 
				 key={message.timestamp}
				 message={message}
				 user={this.state.user}
			/>
		))
	);

	isProgressBarVisible = percent => {
		if (percent > 0) {
			this.setState({progressBar: true});
		}
	};

	displayChannelName = channel => {
		return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
	}

	render() {
		const { messagesRef, messages, channel, user, progressBar, numUniqueUsers, searchTerm, searchResult, searchLoading, privateChannel } = this.state;

		return (
			<React.Fragment>
				<MessagesHeader 
					channelName={this.displayChannelName(channel)}
					numUniqueUsers={numUniqueUsers}
					handleSearchChanged={this.handleSearchChanged}
					searchLoading={searchLoading}
					isPrivateChannel={privateChannel}
				/>

				<Segment>
					<Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
						{searchTerm ? this.displayMessages(searchResult) : this.displayMessages(messages)}
					</Comment.Group>
				</Segment>

				<MessageForm 
					messagesRef={messagesRef}
					currentChannel={channel}
					currentUser={user}
					isProgressBarVisible={this.isProgressBarVisible}
					isPrivateChannel={privateChannel}
					getMessagesRef={this.getMessagesRef}
				/>
			</React.Fragment>
		);
	}
}

export default Messages;