import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import { connect } from 'react-redux';

import ColorPanel from './Colorpanel/ColorPanel';
import SidePanel from './SidePanel/Sidepanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/Metapanel';

const App = ({currentUser}) => (
	<Grid columns="equal" className="app" style={{background: '#eee'}}>
	{console.log(currentUser)}
		<ColorPanel />
    	<SidePanel currentUser={currentUser} />

		<Grid.Column style={{marginLeft: 320}}>
			<Messages />
		</Grid.Column>

		<Grid.Column width={4}>
			<MetaPanel />
		</Grid.Column>
	</Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(App);
