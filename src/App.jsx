import { useState } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [recipient, setRecipient] = useState("");

  /** 📂 File Upload (TXT only for now) */
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

  /** ⚡ Generate Summary + Action Items */
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

  /** 📥 Download PDF */
  const handleDownload = () => {
    if (!summary && actionItems.length === 0) {
      alert("No content to download yet!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16).text("MinuteMind - Meeting Notes", 10, 10);

    // Summary Section
    if (summary) {
      doc.setFontSize(12).text("Summary:", 10, 20);
      doc.setFont("times", "normal").text(summary, 10, 30, { maxWidth: 180 });
    }

    // Action Items Section
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

  /** ✅ Toggle Action Item Checkbox */
  const toggleAction = (id) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  /** 📧 Send Email */
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">MinuteMind — AI Meeting Notes</h1>
        <p className="text-sm text-gray-600">
          Upload your transcript, generate a summary, and share it instantly.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
        {/* 1. Transcript Upload */}
        <section className="bg-white rounded-2xl shadow p-4 space-y-4">
          <h2 className="font-semibold">1. Transcript Input</h2>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-600"
          />
          <textarea
            className="w-full h-40 p-2 border rounded-lg text-sm"
            placeholder="Or paste transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </section>

        {/* 2. Prompt & Generate */}
        <section className="bg-white rounded-2xl shadow p-4 space-y-4">
          <h2 className="font-semibold">2. Prompt & Generate</h2>
          <input
            type="text"
            className="w-full p-2 border rounded-lg text-sm"
            placeholder="e.g. Summarize in bullet points for executives"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate Summary
          </button>
        </section>

        {/* 3. Summary */}
        {summary && (
          <section className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">3. Generated Summary</h2>
            <textarea
              className="w-full h-60 p-2 border rounded-lg text-sm"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </section>
        )}

        {/* 4. Action Items */}
        {actionItems.length > 0 && (
          <section className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">4. Action Items</h2>
            <ul className="space-y-2">
              {actionItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleAction(item.id)}
                  />
                  <span
                    className={item.done ? "line-through text-gray-500" : ""}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 5. Share / Export */}
        <section className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold">5. Share & Export</h2>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Download PDF
            </button>
            <div className="flex-1">
              <input
                type="email"
                className="w-full p-2 border rounded-lg text-sm"
                placeholder="Recipient email..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendEmail}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Send Email
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
