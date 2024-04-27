import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import ArkLogo from '@site/static/img/ark-logo.png'; 
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Feature = ({ title, description, buttonTitle, buttonLink }) => (
  <div className={clsx('col col--4', styles.feature)}>
    <h2>{title}</h2>
    <p>{description}</p>
    <Link className="button button--primary" to={buttonLink}>
      {buttonTitle || 'Learn more'}
    </Link>
  </div>
);


const HomePage = () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout>
      <main>
        <div className={styles.hero}>
          <div className="container">
            <img src={ArkLogo} alt="Ark Logo" className={styles.hero__logo} />
            <h1 className="hero__title">Ark Developer Hub</h1>
            <p className="hero__subtitle">cheap, fast and confidential bitcoin transactions</p>
          </div>
        </div>
        <div className={styles.features}>
          <div className="container">
            <div className="row">
              <Feature
                title="Learn Ark"
                buttonLink={'/docs/learn/nomenclature'}
                description="Dive into the world of Ark with comprehensive learning resources tailored for developers."
              />
              <Feature
                title="Start using Ark"
                buttonTitle={'Get Started'}
                buttonLink={'/docs/user/intro'}
                description="Use ARK for easy, cheap and fast bitcoin transactions"
              />
              <Feature
                title="Provide Liquidity to an Ark"
                buttonTitle={'Run an ASP'}
                buttonLink={'/docs/provider/intro'}
                description="Join the network of service providers to facilitate seamless bitcoin transactions."
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default HomePage;
