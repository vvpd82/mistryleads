import { useState, useEffect } from 'react';

const stages = ["Messaging", "Calling", "Meeting", "Onboarding", "Servicing", "Lost"];

export default function LeadTracker() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', contact: '', source: '', stage: 'Messaging', notes: '', reminder: '', activity: '' });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  const addOrUpdateLead = () => {
    if (!form.name || !form.company) return;
    if (editId) {
      setLeads(leads.map(lead => lead.id === editId ? { ...form, id: editId } : lead));
      setEditId(null);
    } else {
      setLeads([...leads, { ...form, id: Date.now() }]);
    }
    setForm({ name: '', company: '', contact: '', source: '', stage: 'Messaging', notes: '', reminder: '', activity: '' });
  };

  const updateStage = (id, stage) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, stage } : lead));
  };

  const startEdit = (lead) => {
    setForm({
      name: lead.name,
      company: lead.company,
      contact: lead.contact,
      source: lead.source,
      stage: lead.stage,
      notes: lead.notes,
      reminder: lead.reminder || '',
      activity: lead.activity || ''
    });
    setEditId(lead.id);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStage = filter === 'All' || lead.stage === filter;
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || lead.company.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const countByStage = stages.map(stage => ({
    stage,
    count: leads.filter(lead => lead.stage === stage).length
  }));

  const isReminderDue = (reminder) => {
    if (!reminder) return false;
    const today = new Date().toISOString().slice(0, 10);
    return reminder <= today;
  };

  useEffect(() => {
    const overdueLeads = leads.filter(lead => isReminderDue(lead.reminder));
    if (overdueLeads.length > 0) {
      console.log("Overdue reminders:", overdueLeads);
    }
  }, [leads]);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Lead Tracker</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '16px 0' }}>
        {countByStage.map(({ stage, count }) => (
          <div key={stage} style={{ backgroundColor: '#f3f4f6', padding: '8px', borderRadius: '6px', textAlign: 'center', flex: '1 1 120px' }}>
            <strong>{stage}</strong>
            <div>{count} leads</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '16px' }}>
        <input placeholder="Lead Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Company Name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        <input placeholder="Contact Info" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <input placeholder="Source" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
        <input type="date" value={form.reminder} onChange={e => setForm({ ...form, reminder: e.target.value })} />
        <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
          {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
        </select>
      </div>

      <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ width: '100%', height: '60px', marginBottom: '8px' }} />
      <textarea placeholder="Activity Log (e.g. Called on 27 Mar...)" value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} style={{ width: '100%', height: '60px', marginBottom: '8px' }} />
      <button onClick={addOrUpdateLead} style={{ padding: '8px 16px', marginBottom: '24px' }}>{editId ? 'Update Lead' : 'Add Lead'}</button>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <label>Filter by Stage:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
        </select>
        <input placeholder="Search by Name or Company" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {filteredLeads.map(lead => (
          <div key={lead.id} style={{ border: isReminderDue(lead.reminder) ? '2px solid red' : '1px solid #ccc', padding: '12px', borderRadius: '8px' }}>
            <div><strong>{lead.name}</strong> ({lead.company})</div>
            <div style={{ fontSize: '12px', color: '#555' }}>{lead.contact} | Source: {lead.source}</div>
            <div style={{ fontSize: '12px' }}>Reminder: <span style={{ color: isReminderDue(lead.reminder) ? 'red' : '#666' }}>{lead.reminder || '—'}</span></div>
            <div>
              Stage: 
              <select value={lead.stage} onChange={e => updateStage(lead.id, e.target.value)}>
                {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>{lead.notes}</div>
            {lead.activity && <div style={{ fontSize: '12px', marginTop: '4px', color: '#2563eb', whiteSpace: 'pre-wrap' }}>Activity: {lead.activity}</div>}
            <button onClick={() => startEdit(lead)} style={{ marginTop: '8px', padding: '4px 8px' }}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
