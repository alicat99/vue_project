import axios from 'axios';

async function fetchTestData() {
  try {
    // 특정 URL로 GET 요청 보내기
    const response = await axios.get('https://firebasestorage.googleapis.com/v0/b/soongsil-af5dc.appspot.com/o/configs%2FtestInfo.json?alt=media');
    
    // 받은 JSON 데이터를 JavaScript 객체로 변환
    const data = response.data;
    
    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('fetchedData', JSON.stringify(data));
    
    console.log('Data fetched and stored in local storage:', data);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function getTestData() {
  const storedData = localStorage.getItem('fetchedData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  else {
    return await fetchTestData();
  }
}

function filterKeys(data, searchTerm) {
  const searchTerms = searchTerm.split(' ');
  const result = [];
  
  for (const key in data) {
      const includesAllTerms = searchTerms.every(term => key.includes(term));
      if (includesAllTerms) {
          result.push({
            "name": key,
            "data": data[key]
          })
      }
  }
  return result;
}

async function findTest(query) {
  const data = await getTestData();
  
  const queriedData = filterKeys(data, query);
  console.log(queriedData)

  return queriedData
}

async function getTestInfo(name) {
  const data = await getTestData();
  
  if (!(name in data)) {
    return {
      "name": "존재하지 않는 파일입니다",
      "files": []
    }
  }

  const target = data[name]
  const res = []
  for (const key in target) {
    res.push({
      "name": key,
      "url": `https://firebasestorage.googleapis.com/v0/b/soongsil-af5dc.appspot.com/o/files%2F${target[key]}?alt=media`
    })
  }

  return {
    "name": name,
    "files": res
  }
}

export { findTest, getTestInfo }