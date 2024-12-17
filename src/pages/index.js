import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import getBlogPosts from '../utils/getBlogPosts'

const StatsCard = ({ value, description }) => (
  <div className={styles.statsCard}>
    <h2 className={styles.statsValue}>{value}</h2>
    <p className={styles.statsDescription}>{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className={styles.featureCard}>
    <div className={styles.featureIcon}>{icon}</div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
  </div>
);

const BlogPostCard = ({ title, description, date, link }) => (
  <Link to={link} className={styles.blogPostCard}>
    <div className={styles.blogPostDate}>{date}</div>
    <h3 className={styles.blogPostTitle}>{title}</h3>
    <p className={styles.blogPostDescription}>{description}</p>
    <span className={styles.readMore}>Read more →</span>
  </Link>
);

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <div className={styles.layer2Label}>LAYER 2</div>
        <h1 className={styles.heroTitle}>Build on Bitcoin, with Ark</h1>
        <p className={styles.heroSubtitle}>
          Use Bitcoin for a fraction of the cost.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/docs/developers/get-started" className={styles.buttonPrimary}>
            Developers
          </Link>
          <Link to="/docs/learn/concepts" className={styles.buttonSecondary}>
            Learn more
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const latestPosts = getBlogPosts();

  return (
    <Layout title={siteConfig.title}>
      <HomepageHeader />
      <main>
        <section className={styles.poweredBy}>
          <h2>Powered by Bitcoin</h2>
          <p>
            Move your Bitcoin transactions off-chain. With Ark's batching technology,
            you can make instant transfers while maintaining Bitcoin's security.
          </p>
          <p>
            Join thousands of users making cheap Bitcoin transactions!
          </p>
          
          <div className={styles.statsContainer}>
            <StatsCard 
              value="Avg. $4.86"
              description="High transaction cost on the Bitcoin blockchain at scale"
            />
            <StatsCard
              value="$0.289"
              description="Average transaction cost on Ark backed trees"
            />
          </div>
        </section>

        <section className={styles.features}>
          <h2>Transaction batching power</h2>
          <p>
            Ark's strength comes from Bitcoin's security and its innovative transaction
            batching technology. Any Bitcoin Script is compatible and
            connects seamlessly.
          </p>
          
          <div className={styles.featureGrid}>
            <FeatureCard
              icon="💸"
              title="Lower fees"
              description="You can trade, send money globally, or use applications without worrying about high costs."
            />
            <FeatureCard
              icon="👨🏼‍⚖️"
              title="PSBT and Tapscript"
              description="Deploy payments channels, HTLCs, or DLCs, all with same Bitcoin wallet infrastructure."
            />
            <FeatureCard
              icon="🔒"
              title="Bitcoin security"
              description="All transactions are ultimately settled on Bitcoin's blockchain, maintaining its security guarantees."
            />
          </div>
        </section>

        <section className={styles.blogSection}>
          <h2>Latest Updates</h2>
          <p>Stay up to date with Ark's development and community news</p>
          
          <div className={styles.blogGrid}>
            {latestPosts.map(post => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                description={post.description}
                date={new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long'
                })}
                link={post.permalink}
              />
            ))}
          </div>

          <div className={styles.blogCta}>
            <Link to="/blog" className={styles.buttonSecondary}>
              View all updates
            </Link>
          </div>
        </section>

        <section className={styles.callToAction}>
          <h2>Ready to start?</h2>
          <p>Learn how Ark can help you scale your Bitcoin transactions.</p>
          <div className={styles.ctaButtons}>
            <Link to="/docs/quick-start/overview" className={styles.buttonPrimary}>
              Get Started
            </Link>
            <Link to="/docs/learn/concepts" className={styles.buttonSecondary}>
              How Ark works
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}