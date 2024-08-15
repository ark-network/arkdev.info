---
sidebar_position: 1
title: 'Get Started'
---

import Link from '@docusaurus/Link';

<head>
  <style>
    {`
      .sdk-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, auto);
        gap: 20px;
        margin-top: 2rem;
      }
      .sdk-card {
        background-color: #1E1E1E;
        border: 1px solid #FC8D4E;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
      }
      .sdk-card:hover {
        transform: translateY(-5px);
      }
      .sdk-card__header {
        background-color: #FC8D4E;
        color: #121212;
        padding: 16px;
      }
      .sdk-card__header h3 {
        margin: 0;
        font-weight: 600;
      }
      .sdk-card__body {
        padding: 16px;
        color: #FBFBFB;
        flex-grow: 1;
      }
      .sdk-card__footer {
        padding: 16px;
      }
      .sdk-button {
        display: inline-block;
        background-color: #FC8D4E;
        color: #121212;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 500;
        transition: background-color 0.3s ease;
      }
      .sdk-button:hover {
        background-color: #FD9C66;
      }
      @media (max-width: 768px) {
        .sdk-cards {
          grid-template-columns: 1fr;
        }
      }
    `}
  </style>
</head>

# Overview

This guide will help you get started with integrating Ark into your applications.

## Use cases

- Create a Bitcoin wallet for your users with cheap and fast transactions.
- Integrate Ark and Lightning Network to provide a seamless experience for your users.
- Accept Bitcoin payments in your ecommerce store or point of sale.
- Create virtual payment channels between your users.

## SDK Languages

Choose your preferred language to get started:

<div class="sdk-cards">
  <div class="sdk-card">
    <div class="sdk-card__header">
      <h3>Go</h3>
    </div>
    <div class="sdk-card__body">
      <p>Integrate Ark with your Go applications</p>
    </div>
    <div class="sdk-card__footer">
      <Link to="/docs/developers/go" className="sdk-button">Get Started</Link>
    </div>
  </div>
  
  <div class="sdk-card">
    <div class="sdk-card__header">
      <h3>Rust</h3>
    </div>
    <div class="sdk-card__body">
      <p>Build robust Ark integrations with Rust</p>
    </div>
    <div class="sdk-card__footer">
      <Link to="/docs/developers/rust" className="sdk-button">Get Started</Link>
    </div>
  </div>
  
  <div class="sdk-card">
    <div class="sdk-card__header">
      <h3>JavaScript</h3>
    </div>
    <div class="sdk-card__body">
      <p>Add Ark functionality to your web and Node.js projects</p>
    </div>
    <div class="sdk-card__footer">
      <Link to="/docs/developers/javascript" className="sdk-button">Get Started</Link>
    </div>
  </div>
  
  <div class="sdk-card">
    <div class="sdk-card__header">
      <h3>Python</h3>
    </div>
    <div class="sdk-card__body">
      <p>Implement Ark in your Python applications</p>
    </div>
    <div class="sdk-card__footer">
      <Link to="/docs/developers/python" className="sdk-button">Get Started</Link>
    </div>
  </div>
</div>