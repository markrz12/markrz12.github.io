import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar } from "../ui/Common";

function Templates(){
  const [search, setSearch] = useState("");
  const [showAccount, setShowAccount] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [showDelete, setShowDelete] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const accountMenuRef = useRef(null); const accountBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{ function onDoc(e){ if(!showAccount) return; const m=accountMenuRef.current,b=accountBtnRef.current; if(m&&!m.contains(e.target)&&b&&!b.contains(e.target)) setShowAccount(false);} function onKey(e){ if(e.key==='Escape') setShowAccount(false);} document.addEventListener('mousedown',onDoc); document.addEventListener('keydown',onKey); return ()=>{ document.removeEventListener('mousedown',onDoc); document.removeEventListener('keydown',onKey); }; },[showAccount]);

  const initial = useMemo(()=>[
    { id: 1, key: 'dr', name: 'DR', url: 'https://example.com/szablony/dr' },
    { id: 2, key: 'mbp', name: 'MBP', url: 'https://example.com/szablony/mbp' },
  ],[]);
  const [rows, setRows] = useState(initial);

  const filtered = useMemo(()=>{ const q=search.trim().toLowerCase(); if(!q) return rows; return rows.filter(r=>[r.key,r.name,r.url].some(v=>String(v).toLowerCase().includes(q))); },[rows,search]);

  const handleLogout = () => { navigate('/'); setShowAccount(false); };

  return (
    <div className="d-flex min-vh-100" style={{ minHeight: '100vh' }}>
      <Sidebar search={search} setSearch={setSearch} />

      {/* Main column */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflow:'hidden' }}>
        <Topbar
          breadcrumb={[{label:'Home', to:'/'},{label:'Workspace', to:'/workspace'},{label:'Szablony', active:true}]}
          accountBtnRef={accountBtnRef}
          accountMenuRef={accountMenuRef}
          showAccount={showAccount}
          setShowAccount={setShowAccount}
          onLogout={handleLogout}
        />

        {/* Content */}
        <div className="flex-grow-1 bg-light d-flex pt-2 px-2" style={{ minHeight:0 }}>
          <div className="flex-grow-1 d-flex flex-column" style={{ minWidth:0 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header d-flex align-items-center" style={{ gap:'0.5rem' }}>
                <strong>Lista szablonów</strong>

              </div>
              <div className="table-responsive flex-grow-1 pt-2 ps-2 pb-5" style={{ overflow:'auto' }}>
                <table className="table table-hover table-sm mb-0 align-middle" style={{ fontSize:'0.9rem' }}>
                  <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1, whiteSpace:'nowrap' }}>
                    <tr>
                      <th style={{ width:40 }}>#</th>
                      <th>Nazwa</th>
                      <th>Źródło</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx)=> (
                      <tr key={r.id}>
                        <td>{idx+1}</td>
                        <td style={{ whiteSpace:'nowrap' }}>{r.name}</td>
                        <td style={{ wordBreak:'break-word' }}>
                          <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
                        </td>
                        <td style={{ whiteSpace:'nowrap' }}>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>{ setEditItem(r); setForm({ name: r.name, url: r.url }); setShowEdit(true); }}>Edytuj</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>{ setDeleteItem(r); setShowDelete(true); }}>Usuń</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length===0 && (
                      <tr><td colSpan={4} className="text-center text-muted py-4">Brak wyników</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right panel with short info/help */}
          <div className="d-none d-lg-block" style={{ width:360, paddingLeft:12 }}>
            <div className="card shadow-sm h-100 d-flex flex-column" style={{ overflow:'hidden' }}>
              <div className="card-header"><strong>Informacje</strong></div>
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
                <button className="btn btn-primary" onClick={()=>{
                  if(!editItem) return; const name=form.name.trim(); const url=form.url.trim(); if(!name){ alert('Podaj nazwę'); return;} if(!url){ alert('Podaj URL'); return;}
                  setRows(prev=> prev.map(r=> r.id===editItem.id? { ...r, name, url }: r));
                  setShowEdit(false); setEditItem(null);
                }}>Zapisz</button>
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
                <button className="btn btn-danger" onClick={()=>{ if(deleteItem){ setRows(prev=> prev.filter(r=> r.id!==deleteItem.id)); } setShowDelete(false); }}>Usuń</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default Templates;
