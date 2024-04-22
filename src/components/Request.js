export default class Request {
  async fetch(uri, token) {
    try {
      const headers = this.buildHeaders(token);

      const response = await fetch(uri, { headers });

      if (response.status === 401) {
        this.handleUnauthorized();
        return { status: false, data: null };
      }

      const data = await response.json();
      return { status: true, data: data };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { status: false, data: null };
    }
  }

  async patch(uri, body, token) {
    try {
      const headers = this.buildHeaders(token);

      const response = await fetch(`${uri}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body)
      });

      if (response.status === 401) {
        this.handleUnauthorized();
        return { status: false, data: null };
      }

      const data = await response.json();

      if(data.meta && data.meta.status) {
        return { status: true, data };
      } else {
        return { status: false, data }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return { status: false, data: null };
    }
  }

  async post(uri, body, token) {
    try {
      const headers = this.buildHeaders(token);

      const response = await fetch(uri, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (response.status === 401) {
        this.handleUnauthorized();
        return { status: false, data: null };
      }

      const data = await response.json();

      if (data.meta && data.meta.status) {
        return { status: true, data };
      } else {
        return { status: false, data };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return { status: false, data: null };
    }
  }

  async delete(uri, token) {
    try {
      const headers = this.buildHeaders(token);

      const response = await fetch(uri, {
        method: 'DELETE',
        headers
      });

      if (response.status === 401) {
        this.handleUnauthorized();
        return { status: false, data: null };
      }

      const data = await response.json();

      if (data.meta && data.meta.status) {
        return { status: true, data };
      } else {
        return { status: false, data };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return { status: false, data: null };
    }
  }

  buildHeaders(token) {
    let headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  handleUnauthorized() {
    this.$store.commit('clearToken');
    this.$router.push('/masuk');
  }
}
