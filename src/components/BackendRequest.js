import axios from 'axios';

async function fetchTestData() {
  try {
    // 특정 URL로 GET 요청 보내기
    const response = await axios.get('https://firebasestorage.googleapis.com/v0/b/soongsil-af5dc.appspot.com/o/configs%2FtestInfo.json?alt=media');
    
    // 받은 JSON 데이터를 JavaScript 객체로 변환
    const data = response.data;
    
    // 로컬 스토리지에 데이터 저장
    sessionStorage.setItem('fetchedData', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function getTestData() {
  const storedData = sessionStorage.getItem('fetchedData');
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
          const dd = data[key];
          let problem = false;
          let answer = false;
          for (const key2 in dd) {
            if (key2.includes("문제")) {
              problem = true;
            }
            else if (key2.includes("정답")) {
              answer = true;
            }
          }

          result.push({
            "name": key,
            "data": data[key],
            "problem": problem,
            "answer": answer
          })
      }
  }
  return result;
}

async function findTest(query) {
  const data = await getTestData();
  
  const queriedData = filterKeys(data, query);

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

export { getTestData, findTest, getTestInfo }