// index.js
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const FeatureItem = ({icon, title, description, buttonText, buttonLink}) => (
  <div className={styles.featureItem}>
    <img src={icon} alt={title} className={styles.featureIcon} />
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
    <Link to={buttonLink} className={styles.featureButton}>
      {buttonText}
    </Link>
  </div>
);

const Separator = () => <div className={styles.separator}></div>;


function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <img src="/img/ark-cubes.png" alt="Ark Cubes" className={styles.arkCubes} />
        <h1 className={styles.heroTitle}>Build on Ark</h1>
        <p className={styles.heroSubtitle}>Cheap, fast and confidential Bitcoin transactions</p>
        <div className={styles.heroButtons}>
          <Link to="/docs/quick-start/intro" className={`${styles.button} ${styles.buttonPrimary}`}>
            Quick Start <span className={styles.buttonIcon}>⏱️</span>
          </Link>
          <Link to="/blog" className={`${styles.button} ${styles.buttonSecondary}`}>
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Ark is a layer-two protocol designed to scale Bitcoin transactions. It uses a shared UTXO model for confidential and off-chain payments through an intermediary server that cannot access your funds.">
      <HomepageHeader />
      <main className={styles.main}>
        <section className={styles.features}>
          <FeatureItem
            icon="/img/learn-ark.png"
            title="Learn Ark"
            description="Dive into the world of Ark with comprehensive learning resources tailored for developers."
            buttonText="Learn more"
            buttonLink="/docs/learn/intro"
          />
          <Separator />
          <FeatureItem
            icon="/img/use-ark.png"
            title="Start Using Ark"
            description="Use ARK for easy, cheap and fast bitcoin transactions."
            buttonText="Build now"
            buttonLink="/docs/user/intro"
          />
          <Separator />
          <FeatureItem
            icon="/img/provide-liquidity.png"
            title="Provide Liquidity to Ark"
            description="Join the network of service providers to facilitate seamless bitcoin transactions."
            buttonText="Learn more"
            buttonLink="/docs/provider/intro"
          />
        </section>
      </main>
    </Layout>
  );
}