import axios from 'axios';
import { Auth } from 'aws-amplify';

export const addAuthorizationHeader = async () => {
	try {
		let user = await Auth.currentAuthenticatedUser({ bypassCache: false })
		axios.defaults.headers.get['Authorization'] = `Bearer ${user.signInUserSession.idToken.jwtToken}`;
		axios.defaults.headers.post['Authorization'] = `Bearer ${user.signInUserSession.idToken.jwtToken}`;
		axios.defaults.headers.put['Authorization'] = `Bearer ${user.signInUserSession.idToken.jwtToken}`;
		axios.defaults.headers.delete['Authorization'] = `Bearer ${user.signInUserSession.idToken.jwtToken}`;
	} catch (e) {
		console.log(e);
	}
}

export default axios;