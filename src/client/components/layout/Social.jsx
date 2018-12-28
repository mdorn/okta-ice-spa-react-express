import React, { Component } from 'react';

const Social = () => (
  <section className="contact bg-primary" id="contact">
    <div className="container">
      <h2>We <i className="fas fa-heart"></i> new friends!</h2>
      <ul className="list-inline list-social">
        <li className="list-inline-item social-twitter">
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
        </li>
        <li className="list-inline-item social-facebook">
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
        </li>
        <li className="list-inline-item social-google-plus">
          <a href="#">
            <i className="fab fa-google-plus-g"></i>
          </a>
        </li>
      </ul>
    </div>
  </section>
);

export default Social;
