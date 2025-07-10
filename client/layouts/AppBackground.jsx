import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import Spinner from '/components/Spinner';

const AppBackground = ({ children }) => {

    const { backgroundImage, imagesInfo } = React.useContext(UserContext);
    const [hideSpinner, setHideSpinner] = React.useState(false);

    const dimensions = useDimensions(); // Screen size values
    // Hide spinner
    React.useEffect(() => {
        if (backgroundImage !== '' && imagesInfo?.images?.length > 0) setHideSpinner(true);
    }, [backgroundImage, imagesInfo.images]);

    return (
        <>
            {hideSpinner ?
                <ImageBackground
                    className='bg-white'
                    imageStyle={{ opacity: 0.2 }}
                    resizeMode='cover'
                    source={{ uri: backgroundImage }}
                    style={{ height: dimensions?.height, width: dimensions?.width }}
                >
                    {children}
                </ImageBackground>
                :
                <Spinner />}
        </>
    );
}

AppBackground.propTypes = { children: PropTypes.node }

export default AppBackground;