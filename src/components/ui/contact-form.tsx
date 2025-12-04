"use client";
import React, { useState } from "react";

interface ContactFormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data: ContactFormFields = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Message sent successfully!");
        e.currentTarget.reset();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-card1">
        <div className="form-card2">
          <form className="form" onSubmit={handleSubmit}>
            <p className="form-heading">Contact Us</p>
            <div className="form-field">
              <input name="name" required placeholder="Name" className="input-field" type="text" />
            </div>
            <div className="form-field">
              <input name="email" required placeholder="Email" className="input-field" type="email" />
            </div>
            <div className="form-field">
              <input name="subject" required placeholder="Subject" className="input-field" type="text" />
            </div>
            <div className="form-field">
              <textarea
                name="message"
                required
                placeholder="Message"
                cols={30}
                rows={3}
                className="input-field"
              />
            </div>
            <button type="submit" className="sendMessage-btn">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
