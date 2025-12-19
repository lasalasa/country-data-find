import { useState } from 'react'
import {
  findCountry,
  findByCode,
  fuzzyFindCountry,
  findCountriesByCurrency,
  findByCapital,
  findByRegion,
  findByLanguage,
  findByTimezone,
  findByPhoneCode,
  getFlagEmoji,
  getNeighbors
} from 'country-data-find'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('name')
  const [results, setResults] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleSearch = (term = searchTerm, type = searchType) => {
    let res = []
    if (!term) {
      setResults([])
      return
    }

    try {
      switch (type) {
        case 'name':
          const country = findCountry(term)
          res = country ? [country] : []
          break
        case 'code':
          const byCode = findByCode(term)
          res = byCode ? [byCode] : []
          break
        case 'currency':
          res = findCountriesByCurrency(term)
          break
        case 'fuzzy':
          const fuzzy = fuzzyFindCountry(term)
          res = fuzzy ? [fuzzy] : []
          break
        case 'capital':
          const capital = findByCapital(term)
          res = capital ? [capital] : []
          break
        case 'region':
          res = findByRegion(term)
          break
        case 'language':
          res = findByLanguage(term)
          break
        case 'timezone':
          res = findByTimezone(term)
          break
        case 'phone':
          res = findByPhoneCode(term)
          break
        default:
          break
      }
    } catch (e) {
      console.error(e)
    }
    setResults(res)
    setSelectedCountry(null) // Reset selection on new search
  }

  const handleNeighborClick = (code) => {
    setSearchTerm(code)
    setSearchType('code')
    handleSearch(code, 'code')
    // Automatically select the country if found
    const country = findByCode(code)
    if (country) setSelectedCountry(country)
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>🌍 Country Data Explorer</h1>
        <p>Explore the world with <code>country-data-find</code></p>
      </header>

      <div className="search-section">
        <div className="search-controls">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="name">Name (Exact)</option>
            <option value="fuzzy">Name (Fuzzy)</option>
            <option value="code">ISO Code</option>
            <option value="currency">Currency</option>
            <option value="capital">Capital City</option>
            <option value="region">Region</option>
            <option value="language">Language</option>
            <option value="timezone">Timezone</option>
            <option value="phone">Phone Code</option>
          </select>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${searchType}...`}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => handleSearch()}>Search</button>
        </div>
      </div>

      <div className="content-area">
        {results.length > 0 && !selectedCountry && (
          <div className="results-grid">
            {results.map((country, idx) => (
              <div key={idx} className="country-card-mini" onClick={() => setSelectedCountry(country)}>
                <span className="flag-large">{getFlagEmoji(country.ISO2_CODE)}</span>
                <h3>{country.LIST_OF_NAME?.ENG?.[0] || country.ISO3_CODE}</h3>
                <p>{country.REGION}</p>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && searchTerm && !selectedCountry && (
          <div className="empty-state">
            <p>No countries found matching "{searchTerm}"</p>
          </div>
        )}

        {selectedCountry && (
          <div className="country-detail">
            <button className="back-btn" onClick={() => setSelectedCountry(null)}>← Back to Results</button>

            <div className="detail-header">
              <span className="detail-flag">{getFlagEmoji(selectedCountry.ISO2_CODE)}</span>
              <div>
                <h2>{selectedCountry.LIST_OF_NAME?.ENG?.[0]}</h2>
                <div className="badges">
                  <span className="badge region">{selectedCountry.REGION}</span>
                  <span className="badge iso">{selectedCountry.ISO3_CODE}</span>
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-section">
                <h3>📍 Geography</h3>
                <p><strong>Capital:</strong> {selectedCountry.CAPITAL || 'N/A'}</p>
                <p><strong>Area:</strong> {selectedCountry.AREA?.toLocaleString()} km²</p>
                <p><strong>Neighbors:</strong>
                  {selectedCountry.BORDERS?.length > 0 ? (
                    <div className="neighbor-list">
                      {selectedCountry.BORDERS.map(border => (
                        <button key={border} className="link-btn" onClick={() => handleNeighborClick(border)}>
                          {border}
                        </button>
                      ))}
                    </div>
                  ) : ' None'}
                </p>
              </div>

              <div className="detail-section">
                <h3>👥 Demographics</h3>
                <p><strong>Population:</strong> {selectedCountry.POPULATION?.toLocaleString()}</p>
                <p><strong>Demonym:</strong> {selectedCountry.DEMONYM}</p>
                <p><strong>Languages:</strong></p>
                <div className="tag-list">
                  {selectedCountry.LANGUAGES?.map(l => <span key={l} className="tag">{l}</span>)}
                </div>
              </div>

              <div className="detail-section">
                <h3>💰 Economy & Time</h3>
                <p><strong>Currency:</strong></p>
                <ul className="list-unstyled">
                  {selectedCountry.CURRENCY?.map((c, i) => (
                    <li key={i}>{c.NAME?.[0]} ({c.CODE?.[0]}) {c.SYMBOL?.[0]}</li>
                  ))}
                </ul>
                <p><strong>Timezones:</strong></p>
                <div className="tag-list">
                  {selectedCountry.TIMEZONES?.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>

              <div className="detail-section">
                <h3>📞 Codes</h3>
                <p><strong>ISO2:</strong> {selectedCountry.ISO2_CODE}</p>
                <p><strong>ISO3:</strong> {selectedCountry.ISO3_CODE}</p>
                <p><strong>Phone Code:</strong> +{Array.isArray(selectedCountry.PHONE_CODE) ? selectedCountry.PHONE_CODE.join(', +') : selectedCountry.PHONE_CODE}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
