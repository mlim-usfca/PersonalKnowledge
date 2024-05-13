import React from 'react';
import MyLanguage from '../app/translator/translation';

const Footer = () => {
    return (
        <footer className="bg-white h-100 text-center">
            <MyLanguage />
            <p>© 2024 All rights reserved.</p>
        </footer>
    );
};

export default Footer;