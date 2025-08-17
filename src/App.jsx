import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { jsPDF } from "jspdf";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  font-weight: 300;
`;

const MainContent = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.section`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const StepNumber = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  font-size: 0.9rem;
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
`;

const FileUploadContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const FileUploadLabel = styled.label`
  display: block;
  padding: 2rem;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:hover {
    border-color: #667eea;
    background: #edf2f7;
  }
`;

const FileUploadText = styled.div`
  color: #4a5568;
  font-weight: 500;

  .highlight {
    color: #667eea;
    font-weight: 600;
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  left: -9999px;
  opacity: 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(72, 187, 120, 0.4);
          }
        `;
      case 'purple':
        return `
          background: linear-gradient(135deg, #9f7aea, #805ad5);
          color: white;
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(159, 122, 234, 0.4);
          }
        `;
      default:
        return `
          background: #e2e8f0;
          color: #4a5568;
          &:hover {
            background: #cbd5e0;
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

const ActionItemsList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActionItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const ActionText = styled.span`
  flex: 1;
  font-size: 0.95rem;
  color: ${props => props.completed ? '#a0aec0' : '#2d3748'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const ShareContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [user, setUser] = useState(null);
  const backendURL = "https://minutemind-backend.onrender.com"; 

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => setTranscript(e.target.result);
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
    }
  };

  const handleGenerate = async () => {
    if (!transcript) {
      alert("Please provide a transcript first!");
      return;
    }

    try {
      const res = await fetch("https://minutemind-backend.onrender.com/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setSummary(data.summary || "");
        setActionItems(
          (data.actions || []).map((a, i) => ({
            id: i + 1,
            text: a.task,
            done: false,
          }))
        );
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server");
    }
  };

  const handleDownload = () => {
    if (!summary && actionItems.length === 0) {
      alert("No content to download yet!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16).text("MinuteMind - Meeting Notes", 10, 10);

    if (summary) {
      doc.setFontSize(12).text("Summary:", 10, 20);
      doc.setFont("times", "normal").text(summary, 10, 30, { maxWidth: 180 });
    }

    if (actionItems.length > 0) {
      let y = 60;
      doc.setFontSize(12).text("Action Items:", 10, y);
      y += 10;

      actionItems.forEach((item) => {
        const status = item.done ? "[x]" : "[ ]";
        doc.text(`${status} ${item.text}`, 10, y);
        y += 10;
      });
    }

    doc.save("MeetingNotes.pdf");
  };

  const toggleAction = (id) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleSendEmail = async () => {
    if (!recipient) return alert("Enter recipient email!");

    const emailContent = `Summary:\n${summary}\n\nAction Items:\n${actionItems
      .map((a) => (a.done ? "[x] " : "[ ] ") + a.text)
      .join("\n")}`;

    try {
      const res = await fetch("https://minutemind-backend.onrender.com/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          subject: "Meeting Notes - MinuteMind",
          content: emailContent,
        }),
      });

      const data = await res.json();
      if (data.success) alert("✅ Email sent successfully!");
      else alert("❌ Failed to send email.");
    } catch (error) {
      console.error(error);
      alert("❌ Error sending email");
    }
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>MinuteMind</Title>
          <Subtitle>Transform your meeting transcripts into actionable insights</Subtitle>
        </Header>

        <MainContent>
          <Card>
            <CardHeader>
              <StepNumber>1</StepNumber>
              <CardTitle>Upload Transcript</CardTitle>
            </CardHeader>
            
            <FileUploadContainer>
              <FileUploadLabel htmlFor="file-upload">
                <FileUploadText>
                  <span className="highlight">Click to upload</span> or drag and drop your .txt file here
                </FileUploadText>
              </FileUploadLabel>
              <HiddenFileInput
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
              />
            </FileUploadContainer>

            <TextArea
              rows={6}
              placeholder="Or paste your meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </Card>

          <Card>
            <CardHeader>
              <StepNumber>2</StepNumber>
              <CardTitle>Customize & Generate</CardTitle>
            </CardHeader>
            
            <div style={{ marginBottom: '1rem' }}>
              <Input
                type="text"
                placeholder="e.g., Summarize in bullet points for executives"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            
            <Button variant="primary" onClick={handleGenerate}>
              Generate Summary
            </Button>
          </Card>

          {summary && (
            <Card>
              <CardHeader>
                <StepNumber>3</StepNumber>
                <CardTitle>Generated Summary</CardTitle>
              </CardHeader>
              
              <TextArea
                rows={8}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </Card>
          )}

          {actionItems.length > 0 && (
            <Card>
              <CardHeader>
                <StepNumber>4</StepNumber>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              
              <ActionItemsList>
                {actionItems.map((item) => (
                  <ActionItem key={item.id}>
                    <Checkbox
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleAction(item.id)}
                    />
                    <ActionText completed={item.done}>
                      {item.text}
                    </ActionText>
                  </ActionItem>
                ))}
              </ActionItemsList>
            </Card>
          )}

          <Card>
            <CardHeader>
              <StepNumber>3</StepNumber>
              <CardTitle>Share & Export</CardTitle>
            </CardHeader>
            
            <ShareContainer>
              <Button variant="success" onClick={handleDownload}>
                Download PDF
              </Button>
              
              <Input
                type="email"
                placeholder="Enter recipient email..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              
              <Button variant="purple" onClick={handleSendEmail}>
                Send Email
              </Button>
            </ShareContainer>
          </Card>
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;