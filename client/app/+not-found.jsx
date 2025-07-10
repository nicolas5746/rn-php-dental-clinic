import MobileView from '/layouts/MobileView';
import ErrorPage from '/screens/ErrorPage';

const NotFoundScreen = () => {

    return (
        <MobileView>
            <ErrorPage code={404} message='Not Found' />
        </MobileView>
    );
}

export default NotFoundScreen;