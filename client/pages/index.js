import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
  const content = currentUser !== undefined? "Your are signed in": "You are not signed in";
  console.log(currentUser);
  return <h1>{content}</h1>;
};


// This gets called on every request
export const getServerSideProps = async ({req})  => {
  console.log("SERVERSIDE LANDING PAGE");
  // Fetch data from external API
  const {data} = await buildClient({req}).get('/api/users/currentuser');
  // Pass data to the page via props
  return { props: data }
}

export default LandingPage;
