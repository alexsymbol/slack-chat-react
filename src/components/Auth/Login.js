import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Login extends Component {
	state = {
		email: '',
		password: '',
		errors: [],
		loading: false
	};

	displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

	handleChange = event => {
		this.setState({[event.target.name]: event.target.value});
	};

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.setState({errors: [], loading: true});
			firebase
				.auth()
				.signInWithEmailAndPassword(this.state.email, this.state.password)
				.then(signedInUser => {
					console.log(signedInUser);
				})
				.catch(err => {
					console.log(err);
					this.setState({
						errors: this.state.errors.concat(err),
						loading: false
					});
				});
		}	
	};

	isFormValid = ({email, password}) => email && password;

	handleInputError = (errors, inputName) => {
		return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
	};

	render() {
		const { email, password, errors, loading } = this.state;

		return (
			<Grid textAlign="center" verticalAlign="middle" className="app">
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as="h1" icon color="teal" textAlign="center">
						 <Icon name="wechat" color="teal" />
						 Login to DevChat
					</Header>
					<Form onSubmit={this.handleSubmit} size="large">
						<Segment stacked>
							<Form.Input 
								fluid 
								name="email" 
								icon="mail" 
								iconPosition="left" 
								placeholder="Email Address"
								type="email" 
								value={email}
								className={this.handleInputError(errors, 'email')}
								onChange={this.handleChange} />
							
							<Form.Input 
								fluid 
								name="password" 
								icon="lock" 
								iconPosition="left" 
								placeholder="Password"
								type="password" 
								value={password}
								className={this.handleInputError(errors, 'password')}
								onChange={this.handleChange} />
							
							<Button 
								disabled={loading} 
								className={loading ? 'loading' : ''} 
								color="teal" 
								fluid 
								size="large"
							>
								Submit
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>
							<h3>Error</h3>
							{this.displayErrors(errors)}
						</Message>
					)}
					<Message>Don't have an account? <Link to="/register">Register</Link></Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Login; 