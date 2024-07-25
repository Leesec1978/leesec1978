import pandas as pd
import streamlit as st
import seaborn as sns
import numpy as np

# Example data
data = {
    'Category': ['A', 'A', 'B', 'B', 'C', 'C'],
    'Subcategory': ['X', 'Y', 'X', 'Y', 'X', 'Y'],
    'Value': [10, 20, 30, 40, 50, 60]
}
df = pd.DataFrame(data)

def color_negative_red(val):
    color = 'red' if isinstance(val, (int, float)) and val < 0 else 'black'
    return f'color: {color}'

def highlight_max(data, color='yellow'):
    '''
    Highlight the maximum in a Series or DataFrame.
    '''
    attr = f'background-color: {color}'
    if data.ndim == 1:  # Series from .apply(axis=0) or axis=1
        is_max = data == data.max()
        return [attr if v else '' for v in is_max]
    else:  # from .apply(axis=None)
        is_max = data == data.max().max()
        return pd.DataFrame(np.where(is_max, attr, ''),
                            index=data.index, columns=data.columns)

st.title('Pivot Table with Filters in Streamlit')

# Show the original dataframe
st.write("### Original DataFrame")
st.write(df.style.applymap(color_negative_red))

# Sidebar filters
st.sidebar.header("Filter Options")
selected_category = st.sidebar.multiselect('Select Category', options=df['Category'].unique(), default=df['Category'].unique())
selected_subcategory = st.sidebar.multiselect('Select Subcategory', options=df['Subcategory'].unique(), default=df['Subcategory'].unique())
min_value = st.sidebar.slider('Select Minimum Value', min_value=int(df['Value'].min()), max_value=int(df['Value'].max()), value=int(df['Value'].min()))

# Filter the dataframe based on the sidebar filters
filtered_df = df[(df['Category'].isin(selected_category)) & 
                 (df['Subcategory'].isin(selected_subcategory)) & 
                 (df['Value'] >= min_value)]

st.write("### Filtered DataFrame")
st.write(filtered_df.style.applymap(color_negative_red))

# Create the pivot table
pivot_table = filtered_df.pivot_table(
    index='Category',
    columns='Subcategory',
    values='Value',
    aggfunc='sum'
)

# Apply Seaborn color palette to the pivot table
cm = sns.light_palette("green", as_cmap=True)
styled_pivot_table = pivot_table.style.background_gradient(cmap=cm).apply(highlight_max, color='lightgreen', axis=None)

st.write("### Pivot Table")
st.write(styled_pivot_table)
