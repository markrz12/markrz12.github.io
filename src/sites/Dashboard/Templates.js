import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Sidebar, Topbar } from "../../ui/Common";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5171";

function Templates(){
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(()=>{ const q=search.trim().toLowerCase(); if(!q) return rows; return rows.filter(r=>[r.key,r.name,r.url].some(v=>String(v).toLowerCase().includes(q))); },[rows,search]);

  useEffect(()=>{
    let alive = true;
    setLoading(true);
    setError("");
    axios.get(`${API_BASE}/templates`).then(res=>{
      if(!alive) return;
      setRows(res.data || []);
    }).catch(err=>{
      if(!alive) return;
      console.error(err);
      setError("Nie udało się pobrać listy szablonów. Upewnij się, że mock serwer działa.");
    }).finally(()=> alive && setLoading(false));
    return ()=>{ alive=false };
  },[]);

  async function handleSaveEdit(){
    if(!editItem) return;
    const name=form.name.trim(); const url=form.url.trim();
    if(!name){ alert('Podaj nazwę'); return; }
    if(!url){ alert('Podaj URL'); return; }
    const updated = { ...editItem, name, url };
    try{
      const res = await axios.put(`${API_BASE}/templates/${editItem.id}`, updated);
      const saved = res.data || updated;
      setRows(prev=> prev.map(r=> r.id===editItem.id? saved : r));
      setShowEdit(false); setEditItem(null);
    }catch(err){
      console.error(err);
      alert('Nie udało się zapisać zmian.');
    }
  }

  async function handleConfirmDelete(){
    if(!deleteItem) return;
    try{
      await axios.delete(`${API_BASE}/templates/${deleteItem.id}`);
      setRows(prev=> prev.filter(r=> r.id!==deleteItem.id));
      setShowDelete(false); setDeleteItem(null);
    }catch(err){
      console.error(err);
      alert('Nie udało się usunąć elementu.');
    }
  }

  async function handleAdd(){
    const name=form.name.trim(); const url=form.url.trim();
    if(!name){ alert('Podaj nazwę'); return; }
    if(!url){ alert('Podaj URL'); return; }
    const key = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const toCreate = { key, name, url };
    try{
      const res = await axios.post(`${API_BASE}/templates`, toCreate);
      const created = res.data || { ...toCreate };
      setRows(prev=> [...prev, created]);
      setShowAdd(false); setForm({ name: "", url: "" });
    }catch(err){
      console.error(err);
      alert('Nie udało się dodać szablonu.');
    }
  }

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      {/* Main column */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Szablony', active:true}]}
        />

        {/* Content */}
        <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight: 0, padding: '0.75rem 1rem' }}>
          <div className="flex-grow-1 d-flex flex-column" style={{ minWidth:0 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header" style={{ backgroundColor: "#0a2b4c", color: "#ffffff" }}>
                <div className="d-flex align-items-center justify-content-between" style={{padding: '0.5rem 0.3rem'}}>
                  <strong style ={{fontSize: "1.1rem"}}>Lista szablonów</strong>

                </div>
              </div>
              <div className="table-responsive flex-grow-1 " style={{ overflow:'auto' }}>
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                    <tr>
                      <th style={headerStyle}>Nazwa</th>
                      <th style={headerStyle}>Źródło</th>
                      <th style={headerStyle}>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={3} className="text-center text-muted py-4">Ładowanie...</td></tr>
                    )}
                    {error && !loading && (
                      <tr><td colSpan={3} className="text-center text-danger py-4">{error}</td></tr>
                    )}
                    {!loading && !error && filtered.map((r)=> (
                      <tr key={r.id}>
                        <td style={tdDescription}>{r.name}</td>
                        <td style={tdDescription}>
                          <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
                        </td>
                        <td style={tdDescription}>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>{ setEditItem(r); setForm({ name: r.name, url: r.url }); setShowEdit(true); }}>Edytuj</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>{ setDeleteItem(r); setShowDelete(true); }}>Usuń</button>
                        </td>
                      </tr>
                    ))}
                    {!loading && !error && filtered.length===0 && (
                      <tr><td colSpan={3} className="text-center text-muted py-4">Brak wyników</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right panel with short info/help */}
          <div className="d-none d-lg-block" style={{ width:360, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
                <div className="text-center mb-2">
                    <button className="btn btn-success w-100" onClick={()=>setShowAdd(true)} style={{ whiteSpace:'nowrap', minWidth: 220 }}>
                        Dodaj szablon
                    </button>
                </div>
              <div className="card-header" style ={{ padding: '0.6rem 1rem', fontSize: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff",}}><strong>Informacje</strong></div>
              <div className="card-body small" style={{ overflowY:'auto' }}>
                <p className="mb-2">Szablony dokumentów używane w projektach. Kliknij link Źródło, aby otworzyć wzór w zewnętrznym serwisie.</p>

              </div>
            </div>
          </div>
        </div>

        {/* Edit modal */}
        {showEdit && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowEdit(false)}>
            <div className="card shadow" style={{ maxWidth:520, margin:"10vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Edytuj szablon</strong>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowEdit(false)}>Zamknij</button>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <label className="form-label mb-1">Nazwa</label>
                  <input className="form-control" value={form.name} onChange={(e)=>setForm(prev=>({...prev, name: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="form-label mb-1">Adres Źródła (URL)</label>
                  <input className="form-control" value={form.url} onChange={(e)=>setForm(prev=>({...prev, url: e.target.value}))} />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowEdit(false)}>Anuluj</button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>Zapisz</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete modal */}
        {showDelete && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowDelete(false)}>
            <div className="card shadow" style={{ maxWidth:460, margin:"15vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Usuń szablon</strong>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowDelete(false)}>Zamknij</button>
              </div>
              <div className="card-body">
                <p className="mb-2">Czy na pewno chcesz usunąć szablon:</p>
                <p className="mb-0"><strong>{deleteItem?.name}</strong>?</p>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowDelete(false)}>Anuluj</button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Usuń</button>
              </div>
            </div>
          </div>
        )}

        {/* Add modal */}
        {showAdd && (
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background:"rgba(0,0,0,0.35)", zIndex:1050 }} onClick={()=>setShowAdd(false)}>
            <div className="card shadow" style={{ maxWidth:520, margin:"10vh auto", padding:0 }} onClick={(e)=>e.stopPropagation()}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Dodaj szablon</strong>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>setShowAdd(false)}>Zamknij</button>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <label className="form-label mb-1">Nazwa</label>
                  <input className="form-control" value={form.name} onChange={(e)=>setForm(prev=>({...prev, name: e.target.value}))} />
                </div>
                <div className="mb-2">
                  <label className="form-label mb-1">Adres Źródła (URL)</label>
                  <input className="form-control" value={form.url} onChange={(e)=>setForm(prev=>({...prev, url: e.target.value}))} />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-light" onClick={()=>setShowAdd(false)}>Anuluj</button>
                <button className="btn btn-primary" onClick={handleAdd}>Dodaj</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
const headerStyle = { border: "1px solid #dee2e6", paddingLeft: "1rem", backgroundColor: "#0a2b4c", color: "#ffffff", padding: "0.75rem" };
const tdDescription = { border: "1px solid #dee2e6", fontSize: "0.9rem", paddingLeft: "1rem", paddingTop:"0.5rem", paddingBottom:"0.5rem" };

export default Templates;
